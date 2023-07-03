import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import path from 'path'
import { channels } from '../API'
import SettingsManager from '../Utils/SettingsManager'
import ProjectManager from './ProjectManager'
import { value_t } from '../../frontend/src/@types/Settings'
import { loadPage } from '../Utils/ElectronUtils'


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
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {
            await this.init()
        })
        ipc.on('projectSettings:open', () => this.openProjectSettings())
        ipc.handle(channels.toMain.changeProjectSetting, (_, uuid: string, value: value_t) => this.updateSetting(uuid, value))
        ipc.handle(channels.toMain.requestProjectSetting, (_, name) => this.settingsManager.get(name))
        ipc.handle(channels.toMain.requestProjectSettings, () => this.settingsManager.getAll())
        ipc.handle(channels.toMain.unsafeSetProjectSetting, (_, name, value) => this.set<any>(name, value))
        app.on('quit', () => this.saveSettings())
    }

    public async get<Type>(name: string) {
        return await this.settingsManager.get<Type>(name)
    }

    public async getAll() {
        return await this.settingsManager.getAll()
    }

    public async set<Type>(name: string, value: Type) {
        await this.settingsManager.set(name, value)
    }

    public registerSettingUpdateEvent(preferenceName: string, f: (value: any) => void) {
        this.settingsManager.registerSettingUpdateEvent(preferenceName, f)
    }

    // Handles update from frontend
    private async updateSetting(uuid: string, newValue: value_t) {
        await this.settingsManager.setByUuid(uuid, newValue)
    }

    private saveSettings() {
        if(!this.initialized) return
        this.settingsManager.saveSettingToFile()
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
                preload: path.join(__dirname, '../preload.js'),
            },
        })
        loadPage(this.window, 'project-settings')
    }
}
