import {app, dialog, ipcMain as ipc} from 'electron'
import * as fs from 'fs'
import fastFolderSizeSync from 'fast-folder-size/sync'
import MainWindow from '../MainWindow'
import * as Path from 'path'
import Utils from '../BuildSystem/Utils'
import fse from 'fs-extra'


export default class ProjectManager {
    private static instance: ProjectManager
    private readonly zipThresholdInMB: number = 5000
    private mainWindow!: MainWindow
    // The path to the current saved project. This may be the path to a .via file.
    private projectPath!: string
    // The path to the extracted project. May have unsaved changes. May be the same as project path for large projects.
    private _presentWorkingDirectory!: string


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

    private constructor() {
        ipc.on('project-manager:create-new-project', async () => this.createNewProject())
        ipc.on('project-manager:open-project', async () => this.openProjectFromFile())
        ipc.on('project-manager:open-project-folder', async () => this.openProjectFromFolder())
        ipc.on('project-manager:save-project', async () => this.saveProject())
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
            const tempProjectFolder = Path.join(app.getPath('temp'), "viavr/project")
            fs.rmdirSync(tempProjectFolder, {recursive: true})
            this._presentWorkingDirectory = tempProjectFolder
            this.mainWindow.send('project-manager:project-created')
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
        fs.rmdirSync(tempProjectFolder, {recursive: true})
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
        console.log('Project path: ', this.projectPath)
        console.log('Present working directory: ', this.presentWorkingDirectory)
        this.mainWindow.send('project-manager:project-opened')
    }

    private async saveProject() {
        if(this.projectPath === undefined && this.presentWorkingDirectory === undefined) {
            console.log('No project loaded.')
            return
        }

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
                fs.rmdirSync(this.projectPath, {recursive: true})   // Remove .via file that may or may not exist (it does not exist for new projects)
                this.projectPath = Path.join(Path.dirname(this.projectPath), projectFolderName) // TODO: what if this folder already exists and is unrelated?
                fse.copySync(this.presentWorkingDirectory, this.projectPath)
            }
            console.log('Project saved.')
        }
    }
}
