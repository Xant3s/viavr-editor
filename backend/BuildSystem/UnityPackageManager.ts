import { ipcMain as ipc } from 'electron'
import fetch from 'node-fetch'
import { channels } from '../API'
import PreferencesManager from '../Preferences/PreferencesManager'
import { PackageRegistries } from './DataStructures/PackageRegistries'


export default class UnityPackageManager {
    private static instance: UnityPackageManager

    public static getInstance(): UnityPackageManager {
        if(!UnityPackageManager.instance) {
            UnityPackageManager.instance = new UnityPackageManager()
        }
        return UnityPackageManager.instance
    }

    private constructor() {
        ipc.handle(channels.toMain.queryPackages, async (e) => {
            return await this.queryPackagesFromAllRegistries()
        })
    }

    public async queryPackagesFromAllRegistries(filterViavr = true) {
        const registriesSetting = await PreferencesManager.getInstance().get<PackageRegistries>('packageRegistries')
        const registries = registriesSetting.value
        const packageManager = UnityPackageManager.getInstance()
        let packageList: any[] = []
        for(const registry of registries) {
            const scopes = registry.packageRegistryScopes.value
            for(const scope of scopes) {
                const packages = await packageManager.queryPackagesFromRegistry(registry.packageRegistryUrl.value, scope, filterViavr)
                packageList = packageList.concat(packages)
            }
        }
        return packageList
    }

    public async queryPackagesFromRegistry(registryUrl: string, scope: string, filterViavr = true) {
        const response = await fetch(`${registryUrl}/-/v1/search?text=${scope}`)
        const packageList = await response.json()
        // @ts-ignore
        const packages = packageList['objects'].map(obj => obj['package'])
        const packageDetails = await Promise.all(packages.map(p => this.queryPackageDetails(registryUrl, p['name'])))
        let packagesLatestInfo = await Promise.all(packageDetails.map(packageInfo => UnityPackageManager.getLatestPackageVersion(packageInfo)))
        if(filterViavr) {
            packagesLatestInfo = packagesLatestInfo.filter(p => p.keywords && (p.keywords as string[]).indexOf('viavr') !== -1)
        }
        return packagesLatestInfo
    }

    public async queryPackageDetails(registryUrl: string, packageName: string) {
        const res = await fetch(`${registryUrl}/${packageName}`)
        return await res.json()
    }

    public static async getLatestPackageVersion(packageInfo) {
        const latestVersion : string = Object.keys(packageInfo['versions'])
                                             .sort()
                                             .pop() as string
        return packageInfo['versions'][latestVersion]
    }
}
