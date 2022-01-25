import {app, dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import * as util from 'util'
import PreferencesManager from '../Preferences/PreferencesManager'
import BuildSystem from './BuildSystem'

const fs = require('fs').promises
const exec = util.promisify(require('child_process').exec)


export default class UnityBuildManager {
    private readonly buildSystem: BuildSystem
    private buildPath = ''


    constructor(buildSystem: BuildSystem) {
        this.buildSystem = buildSystem
        ipc.on('create-unity-project', async (e, packages) => {
            await this.createEmptyUnityProject(packages)
            e.sender.send('ready-to-build-project')
        })
        ipc.on('build-unity-project', async (e) => {
            await UnityBuildManager.buildUnityProject(this.buildPath)
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
        await UnityBuildManager.addImportedScenesToBuildSettings(outputPath)
        this.buildPath = outputPath
    }

    private static async promptUserForProjectBuildPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }

    private async setupScopedRegistry(outputPath: string) {
        const packageRegistryName = PreferencesManager.getInstance().get<string>('packageRegistryName')
        const packageRegistryUrl = PreferencesManager.getInstance().get<string>('packageRegistryUrl')
        const packageRegistryScope = PreferencesManager.getInstance().get<string>('packageRegistryScope')

        const manifest = await fs.readFile(`${outputPath}/Packages/manifest.json`)
        let manifestData = await JSON.parse(manifest)
        if(!('scopedRegistries' in manifestData)) {
            manifestData['scopedRegistries'] = []
        }

        const registryAlreadyExists = (manifestData['scopedRegistries'] as Array<any>).some(p => p['url'] == packageRegistryUrl)
        if(registryAlreadyExists) return;

        const registryEntry = {
            'name': packageRegistryName,
            'url': packageRegistryUrl,
            'scopes': [
                packageRegistryScope
            ]
        }
        manifestData['scopedRegistries'].push(registryEntry)
        const newFileData = JSON.stringify(manifestData, null, 4)
        await fs.writeFile(`${outputPath}/Packages/manifest.json`, newFileData)
    }

    private async installPackages(outputPath : string, packages : Map<string, boolean>) {
        console.log('Start installing packages.')
        const manifest = await fs.readFile(`${outputPath}/Packages/manifest.json`)
        const manifestData = await JSON.parse(manifest)
        const packageManager = UnityPackageManager.getInstance()
        const packageList = await packageManager.queryPackagesFromRegistry()
        packages.forEach((selectedToInstall: boolean, packageName: string) => {
            if(selectedToInstall) {
                const latestVersion = (packageList.find(p => p.name == packageName).version)
                console.log(`Add package ${packageName}: ${latestVersion}.`)
                manifestData.dependencies[packageName] = latestVersion
            } else {
                console.log(`Skip package ${packageName}.`)
            }
        })

        const newFileData = JSON.stringify(manifestData, null, 4)
        await fs.writeFile(`${outputPath}/Packages/manifest.json`, newFileData)
        console.log('Packages installed.')
    }

    private static async addImportedScenesToBuildSettings(projectPath: string) {
        const unityPath = PreferencesManager.getInstance().get<string>('unityPath')
        const unityAppPath = UnityBuildManager.isMacOS()? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
        const importScenesCommand = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod de.jmu.ge.BuildUtils.SceneImporter.AddScenesToBuildSettings`
        console.log('Start importing scenes.')
        const {stdout, stderr } = await exec(importScenesCommand)
        if(stderr) console.log(stderr)
        console.log(stdout)
        console.log('Scenes imported.')
    }

    private static async buildUnityProject(projectPath: string) {
        const unityPath = PreferencesManager.getInstance().get<string>('unityPath')
        const unityAppPath = UnityBuildManager.isMacOS()? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
        const buildProjectCommand = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod de.jmu.ge.BuildUtils.BuildManager.BuildToDefaultPath`
        console.log('Start building.')
        const {stdout, stderr } = await exec(buildProjectCommand)
        if(stderr) console.log(stderr)
        console.log(stdout)
        console.log('Build finished.')
    }

    private static isMacOS = () => process.platform === 'darwin';
}

