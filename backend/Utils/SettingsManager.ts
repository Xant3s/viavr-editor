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
        this.initialized = this.settings !== undefined
    }

    public async get<Type>(name: string) {
        if(!this.initialized) await this.init()
        if(!this.initialized) throw new Error('SettingsManager not initialized')
        return this.settings[name] as Type
    }

    public async getAll() {
        if(!this.initialized) await this.init()
        if(!this.initialized) throw new Error('SettingsManager not initialized')
        return Object.entries(this.settings)
    }

    public async set<Type>(name: string, value: Type) {
        if(!this.initialized) await this.init()
        if(!this.initialized) throw new Error('SettingsManager not initialized')
        this.settings[name] = value
        await this.saveSettingToFile()
        this.settingUpdateEvents[name]?.emit('update', value)
    }

    public async setByUuid(uuid: string, newValue: value_t, settings: any = this.settings) {
        if(!this.initialized) await this.init()
        if(!this.initialized) throw new Error('SettingsManager not initialized')
        for(const [settingName, setting] of Object.entries(settings)) {
            if(typeof setting !== 'object') continue
            if(!('uuid' in (setting as any))) continue
            const s = setting as Setting_t
            if(s.uuid === uuid) {
                s.value = newValue
            } else if(s.kind === 'composite') {
                await this.setByUuid(uuid, newValue, s.value)
            } else if(s.kind === 'list' && s.listType === 'composite') {
                for(const composite of s.value) {
                    await this.setByUuid(uuid, newValue, composite)
                }
            }
        }

        await this.saveSettingToFile()
        this.settingUpdateEvents['anySetting']?.emit('update', undefined)   // emit update event for any setting. Systems have to load the new value themselves.
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
