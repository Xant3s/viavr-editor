import EventEmitter from 'events'
import {promises as fs} from 'fs'
import * as fs2 from 'fs'
import {Setting_t, value_t} from '../../frontend/src/@types/Settings'

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

    public async setByUuid(uuid: string, newValue: value_t, settings: any = this.settings) {
        for(const [settingName, settingValue] of Object.entries(settings)) {
            if(typeof settingValue !== 'object') continue
            if(!('uuid' in (settingValue as any))) continue
            const val = settingValue as Setting_t
            if(val.uuid === uuid) {
                val.value = newValue
            } else if(val.kind === 'composite') {
                await this.setByUuid(uuid, newValue, val.value)
            }
        }

        await this.saveSettingToFile()
        // TODO: emit update event??
    }

    public registerSettingUpdateEvent(settingName: string, f: (value: any) => void) {
        this.settingUpdateEvents[settingName] = this.settingUpdateEvents[settingName] ?? new EventEmitter()
        this.settingUpdateEvents[settingName].addListener('update', f)
    }

    public async loadSettingsFromFile(path: string = this.settingsPath) {
        if(!(fs2.existsSync(path))) {
            this.settings = {}
            return
        }
        const data = await fs.readFile(path)
        this.settings = JSON.parse(data.toString())
    }

    public async saveSettingToFile(path: string = this.settingsPath) {
        await fs.writeFile(path, JSON.stringify(this.settings, null, 2))
    }
}
