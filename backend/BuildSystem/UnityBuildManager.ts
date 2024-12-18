import { app, dialog, ipcMain as ipc } from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import PreferencesManager from '../Preferences/PreferencesManager'
import BuildSystem from './BuildSystem'
import { PackageManifest } from './DataStructures/PackageManifest'
import { ScopedRegistry } from './DataStructures/ScopedRegistry'
import ProjectManager from '../ProjectManager/ProjectManager'
import AppUtils from '../Utils/AppUtils'
import UnityBridge from './UnityBridge'
import { channels } from '../API'
import { PackageRegistries } from './DataStructures/PackageRegistries'
import { UnityPackageSettingsManager } from './UnityPackageSettingsManager'
import fs from 'fs'
import * as fse from 'fs-extra'
import { PathSetting, Setting_t } from '../../frontend/src/@types/Settings'
import Path from 'path'
import { exec } from 'child_process'
import assert = require('assert')
import { BuildSettingsManager } from './BuildSettingsManager'
import { Logger } from '../Logger'
import { ArticyManager } from '../ArticyManager'


declare global {
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
    private startTime = 0


    constructor(buildSystem: BuildSystem) {
        this.buildSystem = buildSystem
    }

    public initIPC() {
        ipc.handle(channels.toMain.queryScenes, async () => {
            const { sceneFiles } = await UnityBuildManager.findFilesOfTypeInPwd()
            return sceneFiles
        })
        ipc.handle(channels.toMain.createUnityProject, async (_, selectedScenes, selectedPackages) => await this.createUnityProject(selectedScenes, selectedPackages))
        ipc.handle(channels.toMain.buildUnityProject, async () => await this.buildUnityProject())
        ipc.handle(channels.toMain.checkBuildSuccess, async () => this.checkExecutableExists())
        ipc.handle(channels.toMain.openBuildDirectory, async () => await UnityBuildManager.openBuildDirectory(this.buildPath))
        ipc.handle(channels.toMain.queryJsonScenes, async () => {
            const { sceneFiles } = await UnityBuildManager.findFilesOfTypeInPwd('.spoke')
            return sceneFiles
        })
    }

    private async createUnityProject(sceneNames: string[], selectedPackages) {
        const outputPath = await UnityBuildManager.promptUserForProjectBuildPath()
        if(outputPath === undefined) {
            this.buildSystem.buildDialog?.webContents.send('aborted-create-unity-project')
            return
        }
        this.startTime = Date.now()
        Logger.get().log(`Creating Unity project at ${outputPath}`)
        await Utils.extractZipToPath(AppUtils.getResPath() + 'DefaultUnityProject.zip', outputPath)
        await this.setupScopedRegistry(outputPath)
        await this.installPackages(outputPath, selectedPackages)
        await this.installPicoSdk(outputPath)
        await this.importScenes(outputPath, sceneNames)
        await this.exportPackageConfigurations(outputPath)
        await this.exportBuildSettings(outputPath)
        await this.exportAvatars(outputPath)
        await ArticyManager.getInstance().exportToUnity(outputPath)
        Logger.get().log('Finished creating Unity project')
        await Logger.get().logDir(outputPath)
        await Logger.get().save(outputPath + '/build_log.txt')
        this.buildPath = outputPath
        return outputPath
    }

    private static async promptUserForProjectBuildPath(): Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({ 
            properties: ['openDirectory', 'createDirectory'],
            defaultPath: app.getPath('desktop'),
            title: 'Please specify where the VR experience should be created. Make sure the folder is empty.'
        })
        return chosenFolders.filePaths[0]
    }

    private async setupScopedRegistry(outputPath: string) {
        const registriesSetting = await PreferencesManager.getInstance().get<PackageRegistries>('packageRegistries')
        const packageRegistries = registriesSetting.value
        const manifest = await UnityBuildManager.readManifest(outputPath)
        for(const packageRegistry of packageRegistries) {
            const scopes = packageRegistry.packageRegistryScopes.value
            for(const scope of scopes) {
                this.addScopedRegistryToManifest(manifest,
                    packageRegistry.packageRegistryUrl.value,
                    packageRegistry.packageRegistryName.value,
                    scope)
            }
        }

        await UnityBuildManager.writeManifest(manifest, outputPath)
    }

    private static async readManifest(outputPath: string) {
        const manifest = await fs.promises.readFile(`${outputPath}/Packages/manifest.json`)
        const manifestData = manifest.toString()
        return await JSON.parse(manifestData) as PackageManifest
    }

    private static async writeManifest(manifest: PackageManifest, outputPath: string) {
        const newFileData = JSON.stringify(manifest, null, 4)
        await fs.promises.writeFile(`${outputPath}/Packages/manifest.json`, newFileData)
    }

    public addScopedRegistryToManifest(manifest: PackageManifest, packageRegistryUrl: string, packageRegistryName: string, packageRegistryScope: string) {
        manifest.scopedRegistries ??= []
        const scopedRegistry = manifest.scopedRegistries.findOrCreate(reg => reg.url === packageRegistryUrl,
            () => new ScopedRegistry(packageRegistryName, packageRegistryUrl, []))
        scopedRegistry.scopes.findOrCreate(scope => scope === packageRegistryScope, () => packageRegistryScope)
    }

    private async installPackages(outputPath: string, selectedPackages) {
        const manifest = await UnityBuildManager.readManifest(outputPath)
        const packageManager = UnityPackageManager.getInstance()
        const packageList = await packageManager.queryPackagesFromAllRegistries()
        const unfilteredPackageList = await packageManager.queryPackagesFromAllRegistries(false)

        selectedPackages.forEach(selectedPackage => {
            const latestVersion = (packageList.find(p => p.name === selectedPackage.name).version)
            manifest.dependencies ??= []
            manifest.dependencies[selectedPackage.name] = latestVersion
        })
        const supervisorEnabled = await BuildSettingsManager.getInstance().get<boolean>('supervisorEnabled')
        if(supervisorEnabled) {
            const supervisorIntegrationName = 'de.jmu.ge.viavr.supervisorintegration'
            const supervisorIntegrationVersion = (unfilteredPackageList.find(p => p.name === supervisorIntegrationName).version)
            manifest.dependencies ??= []
            manifest.dependencies[supervisorIntegrationName] = supervisorIntegrationVersion
        }

        await UnityBuildManager.writeManifest(manifest, outputPath)
    }
    
    private async installPicoSdk(outputPath: string) {
        const sdkPath = Path.join(AppUtils.getResPath(), 'plugins/picoxr')
        await fse.copy(sdkPath, `${outputPath}/picoxr`)
    }

    private async importScenes(outputPath: string, sceneNames: Array<string>) {
        await Promise.all([
            UnityBuildManager.exportSceneList(outputPath, sceneNames),
            this.exportScenes(outputPath, sceneNames),
        ])
    }

    private static async exportSceneList(outputPath: string, sceneNames: Array<string>) {
        const sceneList = {}
        sceneList['Scenes'] = sceneNames.map(sceneName => sceneName.substring(0, sceneName.length - 4))
        sceneList['Spoke'] = sceneNames.map(sceneName => sceneName.substring(0, sceneName.length - 4)
                                                                  .replace(/ /g, '-')
                                                                  .toLowerCase())
        await fs.promises.writeFile(`${outputPath}/Assets/Settings/Scenes.json`, JSON.stringify(sceneList, null, 4))
    }

    private async exportScenes(outputPath: string, sceneNames: Array<string>) {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const { sceneFiles } = await UnityBuildManager.findFilesOfTypeInPwd('.spoke')
        sceneNames.forEach(sceneName =>
            fs.promises.copyFile(`${pwd}/Scenes/${sceneName}`, `${outputPath}/Assets/Settings/SpokeSceneImporter/${sceneName}`))
        sceneFiles.forEach(file => fs.promises.copyFile(`${pwd}/Scenes/${file}`,`${outputPath}/Assets/Settings/SpokeSceneImporter/${file}`))
    }

    private async exportPackageConfigurations(outputPath: string) {
        const packageConfigurations = await UnityPackageSettingsManager.getInstance().getAllPackageConfigurations()
        for(const [name, packageConfig] of packageConfigurations) {
            const configurationFolder = `${outputPath}/Assets/Settings/${name}/`
            const configuration = this.extractRelevantConfiguration((packageConfig as any).value)
            fs.mkdirSync(configurationFolder, { recursive: true })
            await fs.promises.writeFile(`${configurationFolder}/Configuration.json`, JSON.stringify(configuration, null, 4))
        }
    }
    
    private async exportAvatars(outputPath: string) {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const avatarFolder = `${pwd}/Avatars/`
        const destinationFolder = `${outputPath}/Assets/Avatars/`
        await fse.copy(avatarFolder, destinationFolder)
    }

    private extractRelevantConfiguration(packageConfig: any) {
        const configuration = {}
        for(const [settingName, setting] of Object.entries(packageConfig)) {
            const s = setting as Setting_t
            let value = s.value
            if(s.kind === 'composite') {
                value = this.extractRelevantConfiguration(s.value)
            } else if(s.kind === 'list' && s.listType === 'composite') {
                value = s.value.map(v => this.extractRelevantConfiguration(v))
            }
            configuration[settingName] = value
        }
        return configuration
    }

    private static async findFilesOfTypeInPwd(fileExtension = '.glb') {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        assert(pwd !== undefined)
        const fileList: string[] = await fs.promises.readdir(`${pwd}/Scenes`)
        const sceneFiles = fileList.filter(file => file.endsWith(fileExtension))
        return { pwd, sceneFiles }
    }

    private static async openBuildDirectory(buildPath: string) {
        await exec(`start "" ${buildPath}\\Build`)
    }

    private async exportBuildSettings(outputPath: string) {
        const settingsPath = await BuildSettingsManager.getInstance().settingsPath as string
        await fs.copyFile(settingsPath, `${outputPath}/Assets/Settings/BuildSettings.json`, (err) => {
            if(err) {
                console.error(err)
            }
        })
    }

    private async buildUnityProject() {
        Logger.get().log('Start building Unity project')
        await new UnityBridge().openProject(this.buildPath)
        await Logger.get().logDir(this.buildPath)
        await Logger.get().save(this.buildPath + '/build_log.txt')
        await new UnityBridge().build(this.buildPath)
        await Logger.get().logDir(Path.join(this.buildPath, 'Assets/Scenes'))
        await Logger.get().logDir(Path.join(this.buildPath, 'Build'))
        await Logger.get().save(this.buildPath + '/build_log.txt')
        if(this.checkExecutableExists() === 'failure') {
            Logger.get().logVerbose('Executable does not exist, retrying build only.')
            await new UnityBridge().buildOnly(this.buildPath)
            await Logger.get().logDir(Path.join(this.buildPath, 'Build'))
        }
        Logger.get().log(`Build finished. Executable exists: ${this.checkExecutableExists()}`)
        Logger.get().log(`Build took ${((Date.now() - this.startTime) / 1000 / 60).toFixed(2)} min`)
        await Logger.get().save(this.buildPath + '/build_log.txt')
    }

    private checkExecutableExists() {
        const outFolderName = this.buildPath.split(Path.sep).pop()
        const windowsExecutablePath = Path.join(this.buildPath, 'Build/Windows')
        const windowsExecutableExists = fs.existsSync(windowsExecutablePath) && fs.readdirSync(windowsExecutablePath).length > 0
        const androidExecutablePath = Path.join(this.buildPath, `Build/${outFolderName}.apk`)
        const androidExecutableExists = fs.existsSync(androidExecutablePath)
        return windowsExecutableExists || androidExecutableExists ? 'success' : 'failure'
    }
}

