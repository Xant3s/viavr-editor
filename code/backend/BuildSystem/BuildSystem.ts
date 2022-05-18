import {BrowserWindow, dialog, ipcMain as ipc} from 'electron'
import UnityBuildManager from './UnityBuildManager'
import UnityPackageManager from './UnityPackageManager'
import PreferencesManager from '../Preferences/PreferencesManager'


export default class BuildSystem {
    private readonly mainWindow: BrowserWindow
    private _buildDialog?: BrowserWindow


    constructor(window: BrowserWindow) {
        this.mainWindow = window
        const unityBuildManager = new UnityBuildManager(this)
        unityBuildManager.initIPC()
        UnityPackageManager.getInstance()
        ipc.on('open-build-menu', () => this.openBuildMenu())
        ipc.on('select-unity-path', async (e) => {
            const result = await dialog.showOpenDialog({properties: ['openFile']})
            if(result && !result.canceled){
                const unityPath = result.filePaths[0]
                // TODO: Check if path is valid
                PreferencesManager.getInstance().set('unityPath', unityPath)
            }
        })
    }

    get buildDialog(): Electron.BrowserWindow | undefined {
        return this._buildDialog
    }

    private async openBuildMenu(){
        this._buildDialog = new BrowserWindow(
            {
                width: 700,
                height: 600,
                title: "Build Dialog",
                modal: true,
                parent: this.mainWindow,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true
                }
            }
        )
        this._buildDialog.loadFile('src/Editor/BuildDialog/BuildDialog.html')
    }
}
