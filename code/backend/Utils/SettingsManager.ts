import EventEmitter from 'events'
import {promises as fs} from 'fs'

export default class SettingsManager {
    private readonly settingsPath: string
    private settings
    private settingUpdateEvents: Map<string, EventEmitter> = new Map()
    private initialized = false


    public constructor(settingsPath: string) {
        this.settingsPath = settingsPath
    }

    public async init() {
        await this.loadSettingsFromFile(this.settingsPath)
        this.initialized = true
    }

    public get<Type>(name: string): Type {
        return this.settings[name] as Type
    }

    public getAll() {
        return Object.entries(this.settings)
    }

    public async set<Type>(name: string, value: Type) {
        this.settings[name] = value
        await this.saveSettingToFile()
        this.settingUpdateEvents[name]?.emit('update', value)
    }

    public registerSettingUpdateEvent(settingName: string, f: (value: any) => void) {
        this.settingUpdateEvents[settingName] = this.settingUpdateEvents[settingName] ?? new EventEmitter()
        this.settingUpdateEvents[settingName].addListener('update', f)
    }

    public async loadSettingsFromFile(path: string = this.settingsPath) {
        const data = await fs.readFile(path)
        this.settings = JSON.parse(data.toString())
    }

    public async saveSettingToFile(path: string = this.settingsPath) {
        await fs.writeFile(path, JSON.stringify(this.settings, null, 2))
    }
}
