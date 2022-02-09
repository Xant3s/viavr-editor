import {BrowserWindow, dialog, ipcMain as ipc} from 'electron'
import UnityBuildManager from './UnityBuildManager'
import UnityPackageManager from './UnityPackageManager'
import PreferencesManager from '../Preferences/PreferencesManager'
import MainWindow from '../MainWindow'
import ProjectManager from '../ProjectManager/ProjectManager'
import assert from 'assert'

const fs = require('fs').promises

export default class BuildSystem {
    private readonly mainWindow: MainWindow
    private _buildDialog?: BrowserWindow


    constructor(window: MainWindow) {
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
                height: 500,
                title: "Build Dialog",
                modal: true,
                parent: this.mainWindow.window,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true
                }
            }
        )
        this._buildDialog.loadFile('src/Editor/BuildDialog/BuildDialog.html')
        // const scenes = await this.loadAvailableScenes()
        // this._buildDialog.webContents.send('display-available-scenes', scenes)
    }

    private async loadAvailableScenes() {
        return await BuildSystem.findSceneFiles()
    }

    private static async findSceneFiles() {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        assert(pwd !== undefined)
        const fileList: string[] = await fs.readdir(`${pwd}/Scenes`)
        const sceneFiles = fileList.filter(file => file.endsWith('.glb'))
        return sceneFiles
    }
}
