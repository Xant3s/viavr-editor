import {app, dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import * as util from 'util'
import PreferencesManager from '../Preferences/PreferencesManager'
import BuildSystem from './BuildSystem'
import {PackageManifest} from './DataStructures/PackageManifest'
import {ScopedRegistry} from './DataStructures/ScopedRegistry'

const fs = require('fs').promises
const exec = util.promisify(require('child_process').exec)


declare global{
    interface Array<T> {
        findOrCreate(predicate: (element: T) => boolean, create: () => T): T
    }
}

Array.prototype.findOrCreate = function <T>(predicate: (element: T) => boolean, create: () => T): T {
    const element = this.find(predicate)
    if(element === undefined) {
        this.push(create())
    }
    return this.find(predicate)
}


export default class UnityBuildManager {
    private readonly buildUtilsNamespace = 'de.jmu.ge.BuildUtils'
    private readonly buildSystem: BuildSystem
    private buildPath = ''


    constructor(buildSystem: BuildSystem) {
        this.buildSystem = buildSystem
    }

    public initIPC() {
        ipc.on('create-unity-project', async (e, packages) => {
            await this.createEmptyUnityProject(packages)
            e.sender.send('ready-to-build-project')
        })
        ipc.on('build-unity-project', async (e) => {
            await this.buildUnityProject(this.buildPath)
            e.sender.send('build-finished')
        })
    }

    private async createEmptyUnityProject(packages: Map<string, boolean>) {
        const outputPath = await UnityBuildManager.promptUserForProjectBuildPath()
        if(outputPath === undefined) {
            this.buildSystem.buildDialog?.webContents.send('aborted-create-unity-project')
            console.log('aborted create unity project')
            return
        }
        await Utils.extractZipToPath(app.getAppPath() + '/res/DefaultUnityProject.zip', outputPath)
        await this.setupScopedRegistry(outputPath)
        await this.installPackages(outputPath, packages)
        // await this.addImportedScenesToBuildSettings(outputPath)
        this.buildPath = outputPath
    }

    private static async promptUserForProjectBuildPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }

    private async setupScopedRegistry(outputPath: string) {
        const packageRegistryName = this.loadPreference('packageRegistryName')
        const packageRegistryUrl = this.loadPreference('packageRegistryUrl')
        const packageRegistryScope = this.loadPreference('packageRegistryScope')
        let manifest = await UnityBuildManager.readManifest(outputPath)
        this.addScopedRegistryToManifest(manifest, packageRegistryUrl, packageRegistryName, packageRegistryScope)
        this.addScopedRegistryToManifest(manifest, packageRegistryUrl, packageRegistryName, 'unity-com')    // TODO: no not hardcode
        await UnityBuildManager.writeManifest(manifest, outputPath)
    }

    private loadPreference = (preference: string) => PreferencesManager.getInstance().get<string>(preference)

    private static async readManifest(outputPath: string) {
        const manifestData = await fs.readFile(`${outputPath}/Packages/manifest.json`)
        return await JSON.parse(manifestData) as PackageManifest
    }

    private static async writeManifest(manifest: PackageManifest, outputPath: string) {
        const newFileData = JSON.stringify(manifest, null, 4)
        await fs.writeFile(`${outputPath}/Packages/manifest.json`, newFileData)
    }

    public addScopedRegistryToManifest(manifest: PackageManifest, packageRegistryUrl: string, packageRegistryName: string, packageRegistryScope: string) {
        manifest.scopedRegistries ??= []
        const scopedRegistry = manifest.scopedRegistries.findOrCreate(reg => reg.url === packageRegistryUrl,
            () => new ScopedRegistry(packageRegistryName, packageRegistryUrl, []))
        scopedRegistry.scopes.findOrCreate(scope => scope === packageRegistryScope, () => packageRegistryScope)
    }

    private async installPackages(outputPath : string, packages : Map<string, boolean>) {
        console.log('Start installing packages.')
        const manifest = await UnityBuildManager.readManifest(outputPath)

        const packageManager = UnityPackageManager.getInstance()
        const packageList = await packageManager.queryPackagesFromRegistry()
        packages.forEach((selectedToInstall: boolean, packageName: string) => {
            if(selectedToInstall) {
                const latestVersion = (packageList.find(p => p.name == packageName).version)
                console.log(`Add package ${packageName}: ${latestVersion}.`)
                manifest.dependencies ??= []
                manifest.dependencies[packageName] = latestVersion
            } else {
                console.log(`Skip package ${packageName}.`)
            }
        })

        await UnityBuildManager.writeManifest(manifest, outputPath)
        console.log('Packages installed.')
    }

    private async addImportedScenesToBuildSettings(projectPath: string) {
        console.log('Start importing scenes.')
        await this.invokeUnityMethod(`${this.buildUtilsNamespace}.SceneImporter.AddScenesToBuildSettings`, projectPath);
        console.log('Scenes imported.')
    }

    private async buildUnityProject(projectPath: string) {
        console.log('Start building.')
        await this.invokeUnityMethod(`${this.buildUtilsNamespace}.BuildManager.BuildToDefaultPath`, projectPath);
        console.log('Build finished.')
    }

    private async invokeUnityMethod(method: string, projectPath: string) {
        const unityPath = PreferencesManager.getInstance().get<string>('unityPath')
        const unityAppPath = UnityBuildManager.isMacOS()? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
        const command = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod ${method}`
        const {stdout, stderr } = await exec(command)
        if(stderr) console.log(stderr)
        console.log(stdout)
    }

    private static isMacOS = () => process.platform === 'darwin';
}

