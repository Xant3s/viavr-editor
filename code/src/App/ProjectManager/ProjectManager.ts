import {app, dialog, ipcMain as ipc} from 'electron'
import MainWindow from '../MainWindow'
import * as Path from 'path'
import Utils from '../BuildSystem/Utils'
import * as fs from 'fs'

export default class ProjectManager {
    private static instance: ProjectManager
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
            this.projectPath = filePaths[0]
            const tempProjectFolder = Path.join(app.getPath('temp'), "viavr/project")
            fs.rmdirSync(tempProjectFolder, {recursive: true})
            await Utils.extractZipToPath(filePaths[0], tempProjectFolder)
            this._presentWorkingDirectory = tempProjectFolder
            this.onProjectOpened()
        }
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

    private saveProject() {
        if(this.projectPath === undefined && this.presentWorkingDirectory === undefined) {
            console.log('No project loaded.')
            return
        }

        // Get pwd size

        // if small compress to zip, replace existing zip

        // if large copy to project path if not already, delete zip if exists
    }
}
