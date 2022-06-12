import {BrowserWindow, ipcMain as ipc} from 'electron'
import * as isDev from 'electron-is-dev'
import AppUtils from '../AppUtils'
import path from 'path'
import {channels} from '../API'
import SettingsManager from '../Utils/SettingsManager'


export default class ProjectSettingsManager {
    private settingsManager = new SettingsManager(AppUtils.getResPath() + '/preferences.json')
    private static instance: ProjectSettingsManager
    private window?: BrowserWindow
    private initialized = false


    public static getInstance(): ProjectSettingsManager {
        if(!ProjectSettingsManager.instance) {
            ProjectSettingsManager.instance = new ProjectSettingsManager()
        }
        return ProjectSettingsManager.instance
    }

    public async init() {
        await this.settingsManager.init()
        this.initialized = true
    }

    private constructor() {
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

    public set<Type>(name: string, value: Type) {
        this.settingsManager.set(name, value)
        // this.window?.webContents.send(`preferences:preference-changed-from-backend-${name}`, value)
    }

    public registerSettingUpdateEvent(preferenceName: string, f: (value: any) => void) {
        this.settingsManager.registerSettingUpdateEvent(preferenceName, f)
    }

    // Handles update from frontend
    private updateSetting(pref) {
        this.settingsManager.set(pref.name, pref.value)
    }

    private openProjectSettings() {
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
