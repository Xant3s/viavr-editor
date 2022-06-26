import {v4 as uuid4} from 'uuid'
import SettingsManager from '../Utils/SettingsManager'
import ProjectManager from '../ProjectManager/ProjectManager'
import {ipcMain as ipc} from 'electron'
import {value_t} from '../../frontend/src/@types/Settings'
import {channels} from '../API'

export class UnityPackageSettingsManager {
    private static instance: UnityPackageSettingsManager
    private settingsManager!: SettingsManager
    private initialized = false


    public static getInstance(): UnityPackageSettingsManager {
        if(!UnityPackageSettingsManager.instance) {
            UnityPackageSettingsManager.instance = new UnityPackageSettingsManager()
        }
        return UnityPackageSettingsManager.instance
    }

    private constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {await this.init()})
        ipc.handle(channels.toMain.setPackageSetting, (_, name: string, value) => this.set(name, value))
        ipc.handle(channels.toMain.getPackageSetting, (_, name: string) => this.get(name))
        ipc.on(channels.toMain.changePackageSetting, (_, uuid: string, value: value_t) => this.updateSetting(uuid, value))
        ipc.on('app:quit', () => this.settingsManager.saveSettingToFile())
    }

    private async init() {
        this.settingsManager = new SettingsManager(ProjectManager.getInstance().presentWorkingDirectory + '/packageSettings.json')
        await this.settingsManager.init()
        this.initialized = true
    }

    public async set(name: string, value) {
        const newSetting = {
            'name': name,
            'value': value,
            'uuid': uuid4(),
            'kind': 'composite',
            'label': ''
        }
        await this.settingsManager.set(name, newSetting)
    }

    public getAllPackageConfigurations() {
        return this.settingsManager.getAll()
    }

    private async get(name: string) {
        return await this.settingsManager.get<any>(name)
    }

    // Handles update from frontend
    private async updateSetting(uuid: string, newValue: value_t) {
        await this.settingsManager.setByUuid(uuid, newValue)
    }
}
