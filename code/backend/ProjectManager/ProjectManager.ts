import {app, dialog, ipcMain as ipc} from 'electron'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as Path from 'path'
import MainWindow from '../MainWindow'
import Utils from '../BuildSystem/Utils'
import fastFolderSizeSync = require('fast-folder-size/sync')
import {channels} from '../API'
import EventEmitter from 'events'
import ProjectSettingsManager from './ProjectSettingsManager'

const util = require('util')
const exec = util.promisify(require('child_process').exec)


export default class ProjectManager {
    private static instance: ProjectManager
    private readonly zipThresholdInMB: number = 5000
    private mainWindow!: MainWindow
    // The path to the current saved project. This may be the path to a .via file.
    private projectPath!: string
    // The path to the extracted project. May have unsaved changes. May be the same as project path for large projects.
    private _presentWorkingDirectory!: string
    private onProjectOpenedEvent: EventEmitter = new EventEmitter()

    public static getInstance(): ProjectManager {
        if(!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager()
        }
        return ProjectManager.instance
    }

    public init(mainWindow: MainWindow) {
        this.mainWindow = mainWindow
    }

    get presentWorkingDirectory() {
        return this._presentWorkingDirectory
    }

    public projectIsLoaded() {
        return this.projectPath !== undefined && this.presentWorkingDirectory !== undefined
            && this.projectPath !== '' && this.presentWorkingDirectory !== ''
    }

    public registerOnProjectLoadedListener(callback: () => void) {
        this.onProjectOpenedEvent.addListener('project-loaded', callback)
    }

    private constructor() {
        ipc.on(channels.toMain.createNewProject, async () => this.createNewProject())
        ipc.on(channels.toMain.openProject, async () => this.openProjectFromFile())
        ipc.on(channels.toMain.openProjectFolder, async () => this.openProjectFromFolder())
        ipc.on('project-manager:save-project', async () => this.saveProject())
        ipc.on('dev:open-pwd', async () => this.openPresentWorkingDirectory())
        ipc.handle(channels.toMain.getPresentWorkingDirectory, async () => this._presentWorkingDirectory)
    }

    private async createNewProject() {
        const {canceled, filePath} = await dialog.showSaveDialog(this.mainWindow.window, {
            title: 'Create New Project',
            filters: [
                {name: 'VIA-VR Project', extensions: ['via']}
            ]
        })
        if(!canceled && filePath !== undefined && filePath?.length > 0){
            this.projectPath = filePath
            const tempProjectFolder = Path.join(app.getPath('temp'), "viavr/project/")
            const scenesFolder = Path.join(tempProjectFolder, "Scenes/")
            ProjectManager.ensurePathExists(tempProjectFolder)
            fs.rmSync(tempProjectFolder, {recursive: true})
            ProjectManager.ensurePathExists(scenesFolder)
            this._presentWorkingDirectory = tempProjectFolder
            this.mainWindow.send(channels.fromMain.projectCreated)
            this.onProjectOpenedEvent.emit('project-loaded')
        }
    }

    private async openProjectFromFile() {
        const {canceled, filePaths} = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'VIA-VR project files', extensions: ['via']}]
        })
        if(!canceled && filePaths.length > 0) {
            await this.openProjectFromFileNoPrompt(filePaths[0])
        }
    }

    public async openProjectFromFileNoPrompt(filePath: string) {
        this.projectPath = filePath
        const tempProjectFolder = Path.join(app.getPath('temp'), "viavr/project")
        if(fs.existsSync(tempProjectFolder)) {
            fs.rmSync(tempProjectFolder, {recursive: true})
        }
        await Utils.extractZipToPath(filePath, tempProjectFolder)
        this._presentWorkingDirectory = tempProjectFolder
        this.onProjectOpened()
    }

    private async openProjectFromFolder() {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        if(!canceled && filePaths.length > 0) {
            this.projectPath = filePaths[0]
            this._presentWorkingDirectory = this.projectPath
            this.onProjectOpened()
        }
    }

    private onProjectOpened() {
        this.onProjectOpenedEvent.emit('project-loaded')
        this.mainWindow.send(channels.fromMain.projectOpened)
    }

    private async saveProject() {
        if(this.projectPath === undefined && this.presentWorkingDirectory === undefined) {
            console.error('No project loaded.')
            return
        }

        await ProjectSettingsManager.getInstance().set<string>('dev.viavr.editor.version', app.getVersion())

        const pwdSizeInBytes = fastFolderSizeSync(this.presentWorkingDirectory)
        if(pwdSizeInBytes !== undefined) {
            const pwdSizeInMB = pwdSizeInBytes / 1024 / 1024

            if(pwdSizeInMB < this.zipThresholdInMB) {
                if(Path.parse(this.projectPath).ext.length === 0) {
                    this.projectPath = Path.join(Path.dirname(this.projectPath), Path.parse(this.projectPath).name + '.via')
                    // If the project was previously too large, i.e. the project path is a directory,
                    // we are not removing that directory for now.
                    // The directory equals pwd, so we would get issues if we try to remove it too soon.
                }
                await Utils.compressToPath(this.presentWorkingDirectory, this.projectPath)
                // Now we could delete the old project folder. Not sure if we want to do that.
            } else if(this.projectPath == this.presentWorkingDirectory) {
                // Do nothing.
                // TODO: Architecture: add event
            } else {
                console.log('Project is too large to be save as .via file.')
                // TODO: Notify user
                const projectFolderName = Path.parse(this.projectPath).name
                fs.rmSync(this.projectPath, {recursive: true})   // Remove .via file that may or may not exist (it does not exist for new projects)
                this.projectPath = Path.join(Path.dirname(this.projectPath), projectFolderName) // TODO: what if this folder already exists and is unrelated?
                fse.copySync(this.presentWorkingDirectory, this.projectPath)
            }
            console.log('Project saved.')
        }
    }

    private async openPresentWorkingDirectory() {
        await exec(`start "" ${this.presentWorkingDirectory}`)
    }

    private static ensurePathExists(path: string) {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true})
            console.log(`Created folder ${path}`)
        }
    }
}
