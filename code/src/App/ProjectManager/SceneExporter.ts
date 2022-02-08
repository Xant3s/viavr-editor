import {ipcMain, session} from 'electron'
import MainWindow from '../MainWindow'
import ProjectManager from './ProjectManager'
import * as Path from 'path'


export default class SceneExporter {
    private mainWindow: MainWindow


    constructor(mainWindow: MainWindow) {
        this.mainWindow = mainWindow
        ipcMain.on('save-current-scene', () => this.exportScene())
    }

    private exportScene() {
        this.setSaveScenePathToProjectFolder()
        this.mainWindow.send('spoke:export-scene')
    }

    private setSaveScenePathToProjectFolder() {
        session.defaultSession.on('will-download', async(event, item, webContents) => {
            if(!item.getFilename().endsWith('.glb')) return
            const saveScenePath = Path.join(ProjectManager.getInstance().presentWorkingDirectory, 'Scenes', item.getFilename())
            item.setSavePath(saveScenePath)

            item.once('done', (event, state) => {
                if(state === 'completed') console.log(`Scene ${item.getFilename()} exported`)
                else console.log(`Scene export failed: ${state} (Check path)`)
            })
        })
    }
}
