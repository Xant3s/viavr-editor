import {ipcMain} from 'electron'
import MainWindow from '../MainWindow'

export default class SceneExporter {
    private mainWindow: MainWindow


    constructor(mainWindow: MainWindow) {
        this.mainWindow = mainWindow
        ipcMain.on('save-current-scene', () => this.exportScene())
    }

    private exportScene() {
        this.mainWindow.window.webContents.send('spoke:export-scene')
    }
}
