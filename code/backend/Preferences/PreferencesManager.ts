import {BrowserWindow, ipcMain as ipc} from 'electron'
import * as isDev from 'electron-is-dev'
import AppUtils from '../AppUtils'
import path from 'path'
import {channels} from '../API'

const fs = require('fs').promises


export default class PreferencesManager {
    private static instance: PreferencesManager
    private readonly preferencesPath = AppUtils.getResPath() + '/preferences.json'
    private preferences
    private window?: BrowserWindow
    private initialized = false


    public static getInstance(): PreferencesManager {
        if(!PreferencesManager.instance) {
            PreferencesManager.instance = new PreferencesManager()
        }
        return PreferencesManager.instance
    }

    public async init() {
        await this.loadPreferences(this.preferencesPath)
        this.initialized = true
    }

    private constructor() {
        ipc.on('preferences:open', () => this.openPreferences())
        ipc.on(channels.toMain.changePreference, (_, pref) => this.updatePreference(pref))
        ipc.handle(channels.toMain.requestPreference, (_, name) => this.get(name))
        ipc.on('app:quit', () => this.savePreferences())
    }

    public get<Type>(name: string): Type {
        return this.preferences[name] as Type
    }

    public set<Type>(name: string, value: Type) {
        this.preferences[name] = value
        this.window?.webContents.send(`preferences:preference-changed-from-backend-${name}`, value)
        this.savePreferences()
    }

    // Handles update from frontend
    private updatePreference(pref) {
        this.preferences[pref.name] = pref.value
        this.savePreferences()
    }

    public async loadPreferences(path: string = this.preferencesPath) {
        const data = await fs.readFile(path)
        this.preferences = JSON.parse(data.toString())
    }

    public savePreferences(path: string = this.preferencesPath) {
        fs.writeFile(path, JSON.stringify(this.preferences, null, 2), (err) => {
            if(err) {
                console.log(err)
            }
        })
    }

    private openPreferences() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
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
