import {BrowserWindow, ipcMain as ipc} from 'electron'
import * as isDev from 'electron-is-dev'
import path from 'path'
import {channels} from '../API'
import SettingsManager from '../Utils/SettingsManager'
import ProjectManager from './ProjectManager'


export default class ProjectSettingsManager {
    private settingsManager!: SettingsManager
    private static instance: ProjectSettingsManager
    private window?: BrowserWindow
    private initialized = false


    public static getInstance(): ProjectSettingsManager {
        if(!ProjectSettingsManager.instance) {
            ProjectSettingsManager.instance = new ProjectSettingsManager()
        }
        return ProjectSettingsManager.instance
    }

    private async init() {
        this.settingsManager = new SettingsManager(ProjectManager.getInstance().presentWorkingDirectory + '/projectSettings.json')
        await this.settingsManager.init()
        this.initialized = true
    }

    private constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {await this.init()})
        ipc.on('projectSettings:open', () => this.openProjectSettings())
        ipc.on(channels.toMain.changeProjectSetting, (_, pref) => this. updateSetting(pref))
        ipc.handle(channels.toMain.requestProjectSetting, (_, name) => this.settingsManager.get(name))
        ipc.handle(channels.toMain.requestProjectSettings, () => this.settingsManager.getAll())
        ipc.on('app:quit', () => this.settingsManager.saveSettingToFile())
    }

    public get<Type>(name: string): Type {
        return this.settingsManager.get<Type>(name)
    }

    public getAll() {
        return this.settingsManager.getAll()
    }

    public async set<Type>(name: string, value: Type) {
        await this.settingsManager.set(name, value)
    }

    public registerSettingUpdateEvent(preferenceName: string, f: (value: any) => void) {
        this.settingsManager.registerSettingUpdateEvent(preferenceName, f)
    }

    // Handles update from frontend
    private async updateSetting(pref) {
        await this.settingsManager.set(pref.name, pref.value)
    }

    private openProjectSettings() {
        if(!ProjectManager.getInstance().projectIsLoaded()) {
            console.error('No project loaded')
            return
        }

        this.window = new BrowserWindow({
            width: 800,
            height: 700,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, '../preload.js')
            }
        })
        if (isDev) {
            this.window.loadURL('http://localhost:3000#/project-settings')
        } else {
            this.window.loadURL(`file://${__dirname}/../index.html#/project-settings`)
        }
    }
}
