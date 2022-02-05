import {ipcMain as ipc} from 'electron'
import fetch from 'node-fetch'
import Package from './DataStructures/Package'
import PreferencesManager from '../Preferences/PreferencesManager'


export default class UnityPackageManager {
    private static instance: UnityPackageManager
    private readonly registryUrl: string
    private readonly registryScope: string


    public static getInstance(): UnityPackageManager {
        if (!UnityPackageManager.instance) {
            UnityPackageManager.instance = new UnityPackageManager()
        }
        return UnityPackageManager.instance
    }

    private constructor() {
        this.registryUrl = PreferencesManager.getInstance().get<string>('packageRegistryUrl')
        this.registryScope = PreferencesManager.getInstance().get<string>('packageRegistryScope')
        ipc.on('query-available-packages', async (e) => {
            const packageManager = UnityPackageManager.getInstance()
            const packageList = await packageManager.queryPackagesFromRegistry()
            packageList.forEach(p => e.sender.send('add-package', p as Package))
        })
    }


    public async queryPackagesFromRegistry() {
        const response = await fetch(`${this.registryUrl}/-/v1/search?text=${this.registryScope}`)
        const packageList = await response.json()
        const packages = packageList['objects'].map(obj => obj['package'])
        const packageDetails = await Promise.all(packages.map(p => this.queryPackageDetails(p['name'])))
        const packagesLatestInfo = await Promise.all(packageDetails.map(packageInfo => UnityPackageManager.getLatestPackageVersion(packageInfo)))
        return packagesLatestInfo
    }

    public async queryPackageDetails(packageName: string) {
        const res = await fetch(`${this.registryUrl}/${packageName}`)
        return await res.json()
    }

    public static async getLatestPackageVersion(packageInfo) {
        const latestVersion : string = Object.keys(packageInfo['versions'])
                                             .sort()
                                             .pop() as string
        return packageInfo['versions'][latestVersion]
    }
}
