import {BrowserWindow, dialog, ipcMain as ipc} from 'electron'
import UnityBuildManager from './UnityBuildManager'
import UnityPackageManager from './UnityPackageManager'
import PreferencesManager from '../Preferences/PreferencesManager'

export default class BuildSystem {
    private readonly mainWindow: BrowserWindow

    constructor(window: Electron.BrowserWindow) {
        this.mainWindow = window
        new UnityBuildManager()
        UnityPackageManager.getInstance()
        ipc.on('open-build-menu', () => this.openBuildMenu())
        ipc.on('select-unity-path', async (e) => {
            const unityPath = await BuildSystem.promptUserForPathToUnity()
            // TODO: Check if path is valid
            PreferencesManager.getInstance().set('unityPath', unityPath)
        })
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

    private static async promptUserForPathToUnity() {
        const pathToUnity = await dialog.showOpenDialog({properties: ['openFile']})
        return pathToUnity[0]
    }
}
