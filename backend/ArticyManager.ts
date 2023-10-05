import MainWindow from './MainWindow'
import { ipcMain } from 'electron'
import { channels } from './API'
import ProjectManager from './ProjectManager/ProjectManager'
import * as child_process from 'child_process'
import AppUtils from './Utils/AppUtils'

export class ArticyManager {
    private mainWindow : MainWindow
    private static path = `${AppUtils.getResPath()}plugins/ArticyDraft/ArticyDraft.exe`

    
    public constructor(window : MainWindow) {
        ipcMain.handle(channels.toMain.openArticyEditor, this.openEditorAndDisableWindow.bind(this))
        this.mainWindow = window
    }
    
    public static get articyPath() {
        return ArticyManager.path
    }

    private async openEditorAndDisableWindow(){
        this.mainWindow.disableMenuOptionsOnArticyOpened()
        await this.openArticyEditor()
    }

    private async openArticyEditor() {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const articyStartCommend = `${ArticyManager.path} -edit -path ${pwd}`
        const art = child_process.spawn(articyStartCommend, [], {
            shell: true,
            detached: true,
        })

        art.on('exit', () => {
            this.mainWindow.enableMenuOptionsOnArticyClosed()
        });
    }
}

