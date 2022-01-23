import {app, dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import * as util from 'util'
import PreferencesManager from '../Preferences/PreferencesManager'

const fs = require('fs').promises
const exec = util.promisify(require('child_process').exec)


export default class UnityBuildManager {
    private readonly packageRegistryName: string
    private readonly packageRegistryUrl: string
    private readonly packageRegistryScope: string
    private unityPath = ''
    private buildPath = ''

    constructor() {
        this.packageRegistryName = PreferencesManager.getInstance().get<string>('packageRegistryName')
        this.packageRegistryUrl = PreferencesManager.getInstance().get<string>('packageRegistryUrl')
        this.packageRegistryScope = PreferencesManager.getInstance().get<string>('packageRegistryScope')


        // TODO: Move to BuildSystem
        ipc.on('select-unity-path', async (e) => {
            const unityPath = await UnityBuildManager.promptUserForPathToUnity()
            e.sender.send('selected-unity-path', unityPath)
        })

        // TODO: Move to Preferences
        ipc.on('set-unity-path', (_, args) => this.unityPath = args)


        ipc.on('create-unity-project', async (e, packages) => {
            await this.createEmptyUnityProject(packages)
            e.sender.send('ready-to-build-project')
        })
        ipc.on('build-unity-project', async (e) => {
            await this.buildUnityProject(this.buildPath)
            e.sender.emit('build-finished')
        })
    }

    private async createEmptyUnityProject(packages: Map<string, boolean>) {
        const outputPath = await UnityBuildManager.promptUserForProjectBuildPath()  // TODO: what if user aborts?
        if(outputPath === undefined) {
            ipc.emit('aborted-create-unity-project')
            console.log('aborted create unity project')
            return
        }
        await Utils.extractZipToPath(app.getAppPath() + '/res/DefaultUnityProject.zip', outputPath)
        await this.setupScopedRegistry(outputPath)
        await this.installPackages(outputPath, packages)
        await this.addImportedScenesToBuildSettings(outputPath)
        this.buildPath = outputPath
    }

    private static async promptUserForProjectBuildPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }

    private async setupScopedRegistry(outputPath: string) {
        const manifest = await fs.readFile(`${outputPath}/Packages/manifest.json`)
        let manifestData = await JSON.parse(manifest)
        if(!('scopedRegistries' in manifestData)) {
            manifestData['scopedRegistries'] = []
        }

        const registryAlreadyExists = (manifestData['scopedRegistries'] as Array<any>).some(p => p['url'] == this.packageRegistryUrl)
        if(registryAlreadyExists) return;

        const registryEntry = {
            'name': this.packageRegistryName,
            'url': this.packageRegistryUrl,
            'scopes': [
                this.packageRegistryScope
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
        const unityAppPath = UnityBuildManager.isMacOS()? `${this.unityPath}/Contents/MacOS/Unity` : `${this.unityPath}`
        const importScenesCommand = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod de.jmu.ge.BuildUtils.SceneImporter.AddScenesToBuildSettings`
        console.log('Start importing scenes.')
        const {stdout, stderr } = await exec(importScenesCommand)
        if(stderr) console.log(stderr)
        console.log(stdout)
        console.log('Scenes imported.')
    }

    private async buildUnityProject(projectPath: string) {
        const unityAppPath = UnityBuildManager.isMacOS()? `${this.unityPath}/Contents/MacOS/Unity` : `${this.unityPath}`
        const buildProjectCommand = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod de.jmu.ge.BuildUtils.BuildManager.BuildToDefaultPath`
        console.log('Start building.')
        const {stdout, stderr } = await exec(buildProjectCommand)
        if(stderr) console.log(stderr)
        console.log(stdout)
        console.log('Build finished.')
    }

    private static async promptUserForPathToUnity() {
        const pathToUnity = await dialog.showOpenDialog({properties: ['openFile']})
        return pathToUnity[0]
    }

    private static isMacOS = () => process.platform === 'darwin';
}

