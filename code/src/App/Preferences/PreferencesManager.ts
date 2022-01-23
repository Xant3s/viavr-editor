import Preferences from './Preferences'

const fs = require('fs').promises

export default class PreferencesManager {
    private static instance: PreferencesManager
    private preferences!: Preferences
    private initialized = false


    public static getInstance(): PreferencesManager {
        if(!PreferencesManager.instance) {
            PreferencesManager.instance = new PreferencesManager()
        }
        return PreferencesManager.instance
    }

    public async init() {
        await this.loadPreferences('./res/preferences.json')
        this.initialized = true
    }

    private constructor() {}

    public get<Type>(name: string): Type {
        return this.preferences[name] as Type
    }

    public set<Type>(name: string, value: Type) {
        this.preferences[name] = value
    }

    public async loadPreferences(path: string) {
        const data = await fs.readFile(path)
        this.preferences = JSON.parse(data.toString())
    }

    public savePreferences(path: string) {
        fs.writeFile(path, JSON.stringify(this.preferences, null, 2), (err) => {
            if(err) {
                console.log(err)
            }
        })
    }
}
