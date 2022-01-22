import {BrowserWindow, ipcMain as ipc} from 'electron'
import {mainWindow} from '../main'
import UnityManager from './UnityManager'
import UnityPackageManager from './UnityPackageManager'

export default class BuildSystem {
    constructor() {
        new UnityManager()
        new UnityPackageManager()
        ipc.on('open-build-menu', () => this.openBuildMenu())
    }

    private openBuildMenu(){
        const buildDialog = new BrowserWindow(
            {
                width: 700,
                height: 500,
                title: "Build Dialog",
                modal: true,
                parent: mainWindow,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true
                }
            }
        )
        buildDialog.loadFile('src/Editor/BuildDialog/BuildDialog.html')
    }
}
