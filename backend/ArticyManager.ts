import { ipcMain } from 'electron'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import { Setting_t } from '../frontend/src/@types/Settings'
import child_process from 'child_process'
import ProjectManager from './ProjectManager/ProjectManager'
import MainWindow from './MainWindow'

export class ArticyManager {
    public constructor() {
        ipcMain.handle(channels.toMain.openArticyEditor, this.openArticyEditor)

    private mainWindow : MainWindow
    public constructor(window : MainWindow) {
        this.mainWindow = window
        ipcMain.on(channels.toMain.openArticyEditor, this.openEditorAndDisableWindow.bind(this))
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
