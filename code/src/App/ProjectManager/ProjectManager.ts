import {dialog, ipcMain as ipc} from 'electron'
import MainWindow from '../MainWindow'

export default class ProjectManager {
    private static instance: ProjectManager
    private mainWindow!: MainWindow
    private projectPath!: string
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
        console.log('ProjectManager created')
        ipc.on('project-manager:create-new-project', async () => {
            this.projectPath = await ProjectManager.promptUserForProjectPath()
            this._presentWorkingDirectory = this.projectPath
            console.log('Project path: ', this.projectPath)
            this.mainWindow.send('project-manager:project-created')
        })
        ipc.on('project-manager:open-project', async () => {
            this.projectPath = await ProjectManager.promptUserForProjectPath()
            this._presentWorkingDirectory = this.projectPath
            console.log('Project path: ', this.projectPath)
            this.mainWindow.send('project-manager:project-opened')
        })
    }

    private static async promptUserForProjectPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }
}
