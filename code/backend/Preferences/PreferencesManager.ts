import {BrowserWindow, ipcMain as ipc} from 'electron'
import * as isDev from 'electron-is-dev'
import AppUtils from '../AppUtils'
import path from 'path'
import {channels} from '../API'
import SettingsManager from '../Utils/SettingsManager'
import {value_t} from '../../frontend/src/@types/Settings'


export default class PreferencesManager {
    private settingsManager = new SettingsManager(AppUtils.getResPath() + '/preferences.json')
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
        ipc.on(channels.toMain.changePreference, (_, uuid: string, value: value_t) => this. updatePreference(uuid, value))
        ipc.handle(channels.toMain.requestPreference, (_, name) => this.settingsManager.get(name))
        ipc.handle(channels.toMain.requestPreferences, () => this.settingsManager.getAll())
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
                preload: path.join(__dirname, '../preload.js')
            }
        })
        if (isDev) {
            this.window.loadURL('http://localhost:3000#/preferences')
        } else {
            this.window.loadURL(`file://${__dirname}/../index.html#/preferences`)
        }
    }
}
