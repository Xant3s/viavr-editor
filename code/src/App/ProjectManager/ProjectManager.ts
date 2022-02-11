import {app, dialog, ipcMain as ipc} from 'electron'
import MainWindow from '../MainWindow'
import * as Path from 'path'
import Utils from '../BuildSystem/Utils'

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
        ipc.on('project-manager:create-new-project', async () => {
            // TODO
            this.projectPath = await ProjectManager.promptUserForProjectPath()
            this._presentWorkingDirectory = this.projectPath
            console.log('Project path: ', this.projectPath)
            this.mainWindow.send('project-manager:project-created')
        })
        ipc.on('project-manager:open-project', async () => this.openProjectFromFile())
        ipc.on('project-manager:open-project-folder', async () => this.openProjectFromFolder())
    }

    private async openProjectFromFile() {
        const {canceled, filePaths} = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'VIA-VR project files', extensions: ['via']}]
        })
        if(!canceled && filePaths.length > 0) {
            const tempProjectFolder = Path.join(app.getPath('temp'), "viavr/projects/1")
            this.projectPath = filePaths[0]
            await Utils.extractZipToPath(filePaths[0], tempProjectFolder)
            // TODO use projectID from project settings to extract to unique path in temp folder
            this._presentWorkingDirectory = tempProjectFolder
            this.mainWindow.send('project-manager:project-opened')
            this.onProjectOpened()
        }
    }

    private async openProjectFromFolder() {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        if(!canceled && filePaths.length > 0) {
            this.projectPath = filePaths[0]
            // TODO: copy project folder or change in place?
            this._presentWorkingDirectory = this.projectPath
            this.onProjectOpened()
        }
    }

    private onProjectOpened() {
        console.log('Project path: ', this.projectPath)
        console.log('Present working directory: ', this.presentWorkingDirectory)
        this.mainWindow.send('project-manager:project-opened')
    }

    private static async promptUserForProjectPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory", 'openFile']})
        return chosenFolders.filePaths[0]
    }
}
