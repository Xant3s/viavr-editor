import {BrowserWindow, ipcMain as ipc} from 'electron'
import UnityManager from './UnityManager'
import UnityPackageManager from './UnityPackageManager'

export default class BuildSystem {
    private readonly mainWindow: BrowserWindow

    constructor(window: Electron.BrowserWindow) {
        this.mainWindow = window
        new UnityManager()
        UnityPackageManager.getInstance()
        ipc.on('open-build-menu', () => this.openBuildMenu())
    }

    private openBuildMenu(){
        const buildDialog = new BrowserWindow(
            {
                width: 700,
                height: 500,
                title: "Build Dialog",
                modal: true,
                parent: this.mainWindow,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true
                }
            }
        )
        buildDialog.loadFile('src/Editor/BuildDialog/BuildDialog.html')
    }
}
