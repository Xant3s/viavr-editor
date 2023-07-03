import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import AppUtils from '../Utils/AppUtils'
import path from 'path'
import { channels } from '../API'
import SettingsManager from '../Utils/SettingsManager'
import { value_t } from '../../frontend/src/@types/Settings'
import { loadPage } from '../Utils/ElectronUtils'


export default class PreferencesManager {
    private settingsManager = new SettingsManager(AppUtils.getResPath() + 'preferences.json')
    private static instance: PreferencesManager
    private window?: BrowserWindow
    private initialized = false


    public static getInstance(): PreferencesManager {
        if(!PreferencesManager.instance) {
            PreferencesManager.instance = new PreferencesManager()
        }
        return PreferencesManager.instance
    }

    public async init() {
        await this.settingsManager.init()
        this.initialized = true
    }

    private constructor() {
        ipc.on('preferences:open', () => this.openPreferences())
        ipc.handle(channels.toMain.changePreference, (_, uuid: string, value: value_t) => this.updatePreference(uuid, value))
        ipc.handle(channels.toMain.requestPreference, (_, name) => this.settingsManager.get(name))
        ipc.handle(channels.toMain.requestPreferences, () => this.settingsManager.getAll())
        app.on('quit', () => this.settingsManager.saveSettingToFile())
    }

    public async get<Type>(name: string) {
        return await this.settingsManager.get<Type>(name)
    }

    public async getAll() {
        return await this.settingsManager.getAll()
    }

    public async set<Type>(name: string, value: Type) {
        await this.settingsManager.set(name, value)
        this.window?.webContents.send(`preferences:preference-changed-from-backend-${name}`, value)
    }

    public registerPreferenceUpdateEvent(preferenceName: string, f: (value: any) => void) {
        this.settingsManager.registerSettingUpdateEvent(preferenceName, f)
    }

    // Handles update from frontend
    private async updatePreference(uuid: string, newValue: value_t) {
        await this.settingsManager.setByUuid(uuid, newValue)
    }

    private openPreferences() {
        this.window = new BrowserWindow({
            width: 800,
            height: 700,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, '../preload.js'),
            },
        })
        loadPage(this.window, 'preferences')
    }
}
