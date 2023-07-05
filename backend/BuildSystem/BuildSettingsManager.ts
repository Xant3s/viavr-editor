import SettingsManager from '../Utils/SettingsManager'
import ProjectManager from '../ProjectManager/ProjectManager'
import { app, ipcMain as ipc } from 'electron'
import { channels } from '../API'


export class BuildSettingsManager {
    private static instance: BuildSettingsManager
    private settingsManager!: SettingsManager
    private initialized = false
    private path: string | undefined


    public static getInstance(): BuildSettingsManager {
        if(!BuildSettingsManager.instance) {
            BuildSettingsManager.instance = new BuildSettingsManager()
        }
        return BuildSettingsManager.instance
    }

    private constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {await this.init()})
        ipc.handle(channels.toMain.setBuildSetting, (_, name: string, value) => this.set(name, value))
        ipc.handle(channels.toMain.getBuildSetting, (_, name: string) => this.get(name))
        app.on('quit', () => this.saveSettings())
    }

    private async init() {
        this.path = ProjectManager.getInstance().presentWorkingDirectory + '/buildSettings.json'
        this.settingsManager = new SettingsManager(this.path)
        await this.settingsManager.init()
        this.initialized = true
    }

    public async get<Type>(name: string) {
        await this.settingsManager.loadSettingsFromFile(this.path)
        return await this.settingsManager.get<Type>(name)
    }

    public get settingsPath() {
        return this.path
    }

    public async set<Type>(name: string, value: Type) {
        await this.settingsManager.set(name, value)
    }

    private saveSettings() {
        if(!this.initialized) return
        this.settingsManager.saveSettingToFile()
    }
}