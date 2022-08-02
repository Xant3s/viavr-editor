import {BrowserWindow, ipcMain as ipc} from 'electron'
import path from 'path'
import UnityBuildManager from './UnityBuildManager'
import UnityPackageManager from './UnityPackageManager'
import {UnityPackageSettingsManager} from './UnityPackageSettingsManager'
import {loadPage} from '../Utils/ElectronUtils'


export default class BuildSystem {
    private readonly mainWindow: BrowserWindow
    private _buildDialog?: BrowserWindow


    constructor(window: BrowserWindow) {
        this.mainWindow = window
        const unityBuildManager = new UnityBuildManager(this)
        unityBuildManager.initIPC()
        UnityPackageManager.getInstance()
        UnityPackageSettingsManager.getInstance()
        ipc.on('BuildSystem:open-build-menu', () => this.openBuildMenu())
    }

    get buildDialog(): Electron.BrowserWindow | undefined {
        return this._buildDialog
    }

    private async openBuildMenu(){
        this._buildDialog = new BrowserWindow(
            {
                width: 900,
                height: 900,
                title: "Build Dialog",
                modal: true,
                parent: this.mainWindow,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, '../preload.js')
                }
            }
        )
        loadPage(this._buildDialog, 'build-dialog')
    }
}
