import MainWindow from './MainWindow'
import { ipcMain } from 'electron'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import { Setting_t } from '../frontend/src/@types/Settings'
import ProjectManager from './ProjectManager/ProjectManager'
import * as child_process from 'child_process'

export class ArticyManager {
    private mainWindow : MainWindow

    public constructor(window : MainWindow) {
        ipcMain.handle(channels.toMain.openArticyEditor, this.openEditorAndDisableWindow.bind(this))
        this.mainWindow = window
    }

    private async openEditorAndDisableWindow(){
        this.mainWindow.disableMenuOptionsOnArticyOpened()
        await this.openArticyEditor()
    }

    private async openArticyEditor() {
        const articyPathSetting = await PreferencesManager.getInstance().get<Setting_t>('articyPath')
        const articyPath = articyPathSetting.value as string
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const articyStartCommend = `${articyPath} -edit -path ${pwd}`
        const art = child_process.spawn(articyStartCommend, [], {
            shell: true,
            detached: true,
        })

        art.on('exit', () => {
            this.mainWindow.enableMenuOptionsOnArticyClosed()
        });
    }
}

