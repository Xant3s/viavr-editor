import {app, dialog, ipcMain as ipc} from 'electron'
import Utils from './Utils'
import UnityPackageManager from './UnityPackageManager'
import {exec} from 'child_process'

const fs = require('fs').promises


export default class UnityBuildManager {
    static packageRegistryUrl = 'https://packages.informatik.uni-wuerzburg.de'
    static packageRegistryName = 'Info9 JMU'
    static packageRegistryScope = 'unity-de.jmu'
    private unityPath = ''
    private buildPath = ''

    constructor() {
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
        ipc.on('build-unity-project', () => this.buildUnityProject(this.buildPath))
    }

    private async createEmptyUnityProject(packages: Map<string, boolean>) {
        const outputPath = await UnityBuildManager.promptUserForProjectBuildPath()  // TODO: what if user aborts?
        await Utils.extractZipToPath(app.getAppPath() + '/res/DefaultUnityProject.zip', outputPath)
        await UnityBuildManager.setupScopedRegistry(outputPath)
        await this.installPackages(outputPath, packages)
        await this.addImportedScenesToBuildSettings(outputPath)
        this.buildPath = outputPath
    }

    private static async promptUserForProjectBuildPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }

    private static async setupScopedRegistry(outputPath: string) {
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
        exec(importScenesCommand, err => {
            if(err) console.log(err)
            console.log('Added scenes to build settings.')
        })
    }

    private buildUnityProject(projectPath: string) {
        const unityAppPath = UnityBuildManager.isMacOS()? `${this.unityPath}/Contents/MacOS/Unity` : `${this.unityPath}`
        const buildProjectCommand = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod de.jmu.ge.BuildUtils.BuildManager.BuildToDefaultPath`
        console.log('Start building.')
        exec(buildProjectCommand, err => {
            if(err) console.log(err)
            console.log('Build finished.')
        })
    }

    private static async promptUserForPathToUnity() {
        const pathToUnity = await dialog.showOpenDialog({properties: ['openFile']})
        return pathToUnity[0]
    }

    private static isMacOS = () => process.platform === 'darwin';
}

