import {ipcMain as ipc} from 'electron'
import fetch from 'node-fetch'
import {channels} from '../API'
import PreferencesManager from '../Preferences/PreferencesManager'
import {PackageRegistries} from './DataStructures/PackageRegistries'


export default class UnityPackageManager {
    private static instance: UnityPackageManager

    public static getInstance(): UnityPackageManager {
        if (!UnityPackageManager.instance) {
            UnityPackageManager.instance = new UnityPackageManager()
        }
        return UnityPackageManager.instance
    }

    private constructor() {
        ipc.handle(channels.toMain.queryPackages, async (e) => {
            return await this.queryPackagesFromAllRegistries()
        })
    }

    public async queryPackagesFromAllRegistries() {
        const registries = PreferencesManager.getInstance().get<PackageRegistries>('packageRegistries').value
        const packageManager = UnityPackageManager.getInstance()
        let packageList: any[] = []
        for(const registry of registries) {
            for(const scope of registry.packageRegistryScopes.value) {
                const packages = await packageManager.queryPackagesFromRegistry(registry.packageRegistryUrl.value, scope)
                packageList = packageList.concat(packages)
            }
        }
        return packageList
    }

    public async queryPackagesFromRegistry(registryUrl: string, scope: string) {
        const response = await fetch(`${registryUrl}/-/v1/search?text=${scope}`)
        const packageList = await response.json()
        // @ts-ignore
        const packages = packageList['objects'].map(obj => obj['package'])
        const packageDetails = await Promise.all(packages.map(p => this.queryPackageDetails(registryUrl, p['name'])))
        const packagesLatestInfo = await Promise.all(packageDetails.map(packageInfo => UnityPackageManager.getLatestPackageVersion(packageInfo)))
        const viavrPackagesLatestInfo = packagesLatestInfo.filter(p => p.keywords && (p.keywords as string[]).indexOf('viavr') !== -1)
        return viavrPackagesLatestInfo
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
