import { BrowserWindow, ipcMain as ipc } from 'electron'
import path from 'path'
import UnityBuildManager from './UnityBuildManager'
import UnityPackageManager from './UnityPackageManager'
import { UnityPackageSettingsManager } from './UnityPackageSettingsManager'
import { loadPage } from '../Utils/ElectronUtils'
import { BuildSettingsManager } from './BuildSettingsManager'
import { channels } from '../API'
import * as fs from 'fs/promises'
import ProjectManager from '../ProjectManager/ProjectManager'


export default class BuildSystem {
    private readonly mainWindow: BrowserWindow
    private _buildDialog?: BrowserWindow
    private floorMapEditor?: BrowserWindow
    private floorMapSvg: string | undefined


    constructor(window: BrowserWindow) {
        this.mainWindow = window
        const unityBuildManager = new UnityBuildManager(this)
        unityBuildManager.initIPC()
        UnityPackageManager.getInstance()
        BuildSettingsManager.getInstance()
        UnityPackageSettingsManager.getInstance()
        ipc.handle('BuildSystem:open-build-menu', () => this.openBuildMenu())
        ipc.handle('BuildSystem:open-floor-map-editor', () => this.openFloorMapEditor())
        ipc.handle(channels.toMain.floorMapNewPng, (_, image) => this.saveFloorMapImage(image))
        ipc.handle(channels.toMain.floorMapNewSvg, (_, image) => this.saveFloorMapSvg(image))
        ipc.handle(channels.toMain.floorMapGetSvg, () => this.floorMapSvg)
        ipc.handle(channels.toMain.floorMapLoadSvg, () => this.loadFloorMapSvg())
        ipc.handle(channels.toMain.floorMapEditorConfirmClose, () => this.forceCloseFloorMapEditor())
        ipc.handle(channels.toMain.floorMapEditorCancelClose, () => {/* Do nothing, user cancelled */ })
    }

    private async saveFloorMapImage(imageData: string) {
        const base64Data = imageData.replace(/^data:image\/png;base64,/, '')
        try {
            await fs.writeFile(path.join(ProjectManager.getInstance().presentWorkingDirectory, 'floorMap.png'), base64Data, "base64")
        } catch (err) {
            console.log(err)
        }
    }

    private async saveFloorMapSvg(svgData: string) {
        this.floorMapSvg = svgData
        try {
            await fs.writeFile(path.join(ProjectManager.getInstance().presentWorkingDirectory, 'floorMap.xmlsvg'), svgData)
        } catch (err) {
            console.log(err)
        }
    }

    private async loadFloorMapSvg() {
        try {
            const floorMapData = await fs.readFile(path.join(ProjectManager.getInstance().presentWorkingDirectory, 'floorMap.xmlsvg'))
            return floorMapData.toString()
        } catch (err) {
            console.log('No floor map found')
            return undefined
        }
    }

    get buildDialog(): Electron.BrowserWindow | undefined {
        return this._buildDialog
    }

    private async openBuildMenu() {
        this._buildDialog = this.openWindow('build-dialog')
    }

    private async openFloorMapEditor() {
        this.floorMapEditor = this.openWindow('floor-map-editor', 1200, 800)
        this.floorMapEditor.on('close', (e) => {
            e.preventDefault()
            this.floorMapEditor?.webContents.send(channels.fromMain.floorMapEditorTryClose)
        })
    }

    private forceCloseFloorMapEditor() {
        if (this.floorMapEditor) {
            this.floorMapEditor.destroy()
            this.floorMapEditor = undefined
        }
    }

    private openWindow(page: string, width = 900, height = 900) {
        const window = new BrowserWindow(
            {
                width: width,
                height: height,
                modal: true,
                parent: this.mainWindow,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, '../preload.js'),
                },
            },
        )
        loadPage(window, page)
        return window
    }
}
