import { ipcMain, session } from 'electron'
import MainWindow from '../MainWindow'
import ProjectManager from './ProjectManager'
import * as Path from 'path'
import { API, channels } from '../API'

export default class SceneExporter {
    private mainWindow: MainWindow
    private startedToExportSpoke = false
    private exportedSpoke = false
    private exportedGlb = false


    constructor(mainWindow: MainWindow) {
        this.mainWindow = mainWindow
        this.setSaveScenePathToProjectFolder()
        ipcMain.on('save-current-scene', () => this.exportScene())
        ipcMain.handle(API.channels.toMain.saveScene, () => this.exportScene())
    }

    public async exportScene(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.startedToExportSpoke = false
            this.exportedSpoke = false
            this.exportedGlb = false
            this.mainWindow.send(channels.fromMain.spokeExportScene)

            const checkIsDone = () => {
                if(!this.exportedSpoke || !this.exportedGlb) {
                    setTimeout(checkIsDone, 100)
                } else {
                    resolve()
                }
            }

            checkIsDone()
        })
    }

    private setSaveScenePathToProjectFolder() {
        session.defaultSession.on('will-download', async (event, item, webContents) => {
            if (!item.getFilename().endsWith('.glb') && !item.getFilename().endsWith('.spoke')) return
            if(item.getFilename().endsWith('.spoke') && this.startedToExportSpoke) {
                item.cancel()
                return
            }
            this.startedToExportSpoke = true
            const saveScenePath = Path.join(
                ProjectManager.getInstance().presentWorkingDirectory,
                'Scenes',
                item.getFilename()
            )
            item.setSavePath(saveScenePath)

            item.once('done', (event, state) => {
                if(state === 'completed') {
                    console.log(`Scene ${item.getFilename()} exported`)
                    if(item.getFilename().endsWith('.glb')) {
                        this.mainWindow.send(channels.fromMain.spokeSceneSavedSuccessfully)
                    }
                }
                else {
                    console.log(`Scene export failed: ${state} (Check path)`)
                    console.log(saveScenePath)
                }
                if(item.getFilename().endsWith('.glb')) {
                    this.exportedGlb = true
                } else {
                    this.exportedSpoke = true
                }
            })
        })
    }
}
