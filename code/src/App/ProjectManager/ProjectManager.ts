import {dialog, ipcMain as ipc} from 'electron'

export default class ProjectManager {
    private static instance: ProjectManager
    private projectPath
    private presentWorkingDirectory


    public static getInstance(): ProjectManager {
        if(!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager()
        }
        return ProjectManager.instance
    }

    private constructor() {
        ipc.on('project-manager:create-new-project', async () => {
            this.projectPath = await ProjectManager.promptUserForProjectPath()
            this.presentWorkingDirectory = this.projectPath
            console.log('Project path: ', this.projectPath)
        })
        ipc.on('project-manager:open-project', async () => {
            this.projectPath = await ProjectManager.promptUserForProjectPath()
            this.presentWorkingDirectory = this.projectPath
            console.log('Project path: ', this.projectPath)
        })
    }

    private static async promptUserForProjectPath() : Promise<string> {
        const chosenFolders = await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
        return chosenFolders.filePaths[0]
    }
}
