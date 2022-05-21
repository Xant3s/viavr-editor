import {dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import * as util from 'util'
import PreferencesManager from '../Preferences/PreferencesManager'
import BuildSystem from './BuildSystem'
import {PackageManifest} from './DataStructures/PackageManifest'
import {ScopedRegistry} from './DataStructures/ScopedRegistry'
import ProjectManager from '../ProjectManager/ProjectManager'
import assert = require('assert')
import AppUtils from '../AppUtils'
import UnityBridge from './UnityBridge'

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
    private readonly buildSystem: BuildSystem
    private buildPath = ''


    constructor(buildSystem: BuildSystem) {
        this.buildSystem = buildSystem
    }

    public initIPC() {
        ipc.handle('query-available-scenes', async (e) => {
            const {sceneFiles} = await UnityBuildManager.findFilesOfTypeInPwd()
            return sceneFiles
        })
        ipc.on('create-unity-project', async (e, selectedScenes, selectedPackages) => {
            await this.createUnityProject(selectedScenes, selectedPackages)
            e.sender.send('ready-to-build-project')
        })
        ipc.on('build-unity-project', async (e) => {
            await new UnityBridge().build(this.buildPath)
            e.sender.send('build-finished')
        })
        ipc.on('open-build-directory', async (e) => {
            await UnityBuildManager.openBuildDirectory(this.buildPath)
        })
        ipc.handle('query-available-json-scenes', async (e) => {
            const {sceneFiles} = await UnityBuildManager.findFilesOfTypeInPwd('.spoke')
            return sceneFiles
        })
    }

    private async createUnityProject(sceneNames, selectedPackages) {
        const outputPath = await UnityBuildManager.promptUserForProjectBuildPath()
        if(outputPath === undefined) {
            this.buildSystem.buildDialog?.webContents.send('aborted-create-unity-project')
            console.log('aborted create unity project')
            return
        }
        await Utils.extractZipToPath(AppUtils.getResPath() + '/DefaultUnityProject.zip', outputPath)
        await this.setupScopedRegistry(outputPath)
        await this.installPackages(outputPath, selectedPackages)
        await this.importScenes(outputPath, sceneNames)
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

    private async installPackages(outputPath : string, selectedPackages) {
        console.log('Start installing packages.')
        const manifest = await UnityBuildManager.readManifest(outputPath)

        const packageManager = UnityPackageManager.getInstance()
        const packageList = await packageManager.queryPackagesFromRegistry()
        selectedPackages.forEach(selectedPackage => {
            const latestVersion = (packageList.find(p => p.name === selectedPackage.name).version)
            console.log(`Add package ${selectedPackage.name}: ${latestVersion}.`)
            manifest.dependencies ??= []
            manifest.dependencies[selectedPackage.name] = latestVersion
        })

        await UnityBuildManager.writeManifest(manifest, outputPath)
        console.log('Packages installed.')
    }

    private async importScenes(outputPath: string, sceneNames: Array<string>) {
        await Promise.all([
            UnityBuildManager.exportSceneList(outputPath, sceneNames),
            this.exportScenes(outputPath, sceneNames)
        ])
    }

    private static async exportSceneList(outputPath: string, sceneNames: Array<string>) {
        let sceneList = {}
        sceneList["Scenes"] = sceneNames.map(sceneName => sceneName.substr(0, sceneName.length - 4))
        await fs.writeFile(`${outputPath}/Assets/Settings/Scenes.json`, JSON.stringify(sceneList, null, 4))
    }

    private async exportScenes(outputPath: string, sceneNames: Array<string>) {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        sceneNames.forEach(sceneName =>
            fs.copyFile(`${pwd}/Scenes/${sceneName}`, `${outputPath}/Assets/Settings/SpokeSceneImporter/${sceneName}`))
    }

    private static async findFilesOfTypeInPwd(fileExtension: string = '.glb') {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        assert(pwd !== undefined)
        const fileList: string[] = await fs.readdir(`${pwd}/Scenes`)
        const sceneFiles = fileList.filter(file => file.endsWith(fileExtension))
        return {pwd, sceneFiles}
    }

    private static async openBuildDirectory(buildPath: string) {
        await exec(`start "" ${buildPath}\\Build\\Windows`)
    }
}

