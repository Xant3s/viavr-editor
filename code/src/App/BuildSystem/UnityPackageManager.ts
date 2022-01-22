import {ipcMain as ipc} from 'electron'
import Package from './Package'
import fetch from 'node-fetch'


ipc.on('query-available-packages', async (e) => {
    const packageManager = new UnityPackageManager()
    e.sender.send('clear-packages')
    const packageList = await packageManager.queryPackagesFromRegistry()
    packageList.forEach(p => e.sender.send('add-package', p as Package))
})


export default class UnityPackageManager {
    static registryUrl = 'https://packages.informatik.uni-wuerzburg.de'

    public async queryPackagesFromRegistry() {
        const response = await fetch(`${UnityPackageManager.registryUrl}/-/v1/search?text=unity-de.jmu.ge`)
        const packageList = await response.json()
        const packages = packageList['objects'].map(obj => obj['package'])
        const packageDetails = await Promise.all(packages.map(p => UnityPackageManager.queryPackageDetails(p['name'])))
        const packagesLatestInfo = await Promise.all(packageDetails.map(packageInfo => UnityPackageManager.getLatestPackageVersion(packageInfo)))
        return packagesLatestInfo
    }

    public static async queryPackageDetails(packageName: string) {
        const res = await fetch(`${UnityPackageManager.registryUrl}/${packageName}`)
        return await res.json()
    }

    public static async getLatestPackageVersion(packageInfo) {
        const latestVersion : string = Object.keys(packageInfo['versions'])
                                             .sort()
                                             .pop() as string
        return packageInfo['versions'][latestVersion]
    }
}
