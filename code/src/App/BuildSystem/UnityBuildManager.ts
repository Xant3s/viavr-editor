import {app, dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import * as util from 'util'
import PreferencesManager from '../Preferences/PreferencesManager'
import BuildSystem from './BuildSystem'

const fs = require('fs').promises
const exec = util.promisify(require('child_process').exec)


export default class UnityBuildManager {
    private readonly buildUtilsNamespace = 'de.jmu.ge.BuildUtils'
    private readonly buildSystem: BuildSystem
    private buildPath = ''


    constructor(buildSystem: BuildSystem) {
        this.buildSystem = buildSystem
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
        await this.setupScopedComRegistry(outputPath)
        await this.installPackages(outputPath, packages)
        await this.addImportedScenesToBuildSettings(outputPath)
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

    // TODO: Refactor
    private async setupScopedComRegistry(outputPath: string) {
        const packageRegistryName = 'JMU Info9 Com'
        const packageRegistryUrl = 'https://packages.informatik.uni-wuerzburg.de'
        const packageRegistryScope = 'unity-com'

        const manifest = await fs.readFile(`${outputPath}/Packages/manifest.json`)
        let manifestData = await JSON.parse(manifest)
        if(!('scopedRegistries' in manifestData)) {
            manifestData['scopedRegistries'] = []
        }

        // const registryAlreadyExists = (manifestData['scopedRegistries'] as Array<any>).some(p => p['url'] == packageRegistryUrl)
        // if(registryAlreadyExists) return;

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

