import {BrowserWindow, ipcMain as ipc} from 'electron'
import Preferences from './Preferences'
import PreferencesChannel from './PreferencesChannel'

const fs = require('fs').promises


export default class PreferencesManager {
    private static instance: PreferencesManager
    private readonly preferencesPath = './res/preferences.json'
    private preferences!: Preferences
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
        ipc.on('open-preferences', () => PreferencesManager.openPreferences())
        ipc.on('preferences-changed', (_, pref) => this.updatePreference(pref))
        ipc.on('app-quit', () => this.savePreferences())
        new PreferencesChannel()
    }

    public get<Type>(name: string): Type {
        return this.preferences[name] as Type
    }

    public set<Type>(name: string, value: Type) {
        this.preferences[name] = value
    }

    private updatePreference(pref) {
        this.preferences[pref.name] = pref.value
        console.log(`Preference ${pref.name} changed to ${pref.value}`)
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

    private static openPreferences() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
        win.loadFile('src/Editor/Preferences/Preferences.html')
        win.webContents.openDevTools()
    }
}
