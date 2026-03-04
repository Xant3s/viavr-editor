import MainWindow from './MainWindow'
import { ipcMain } from 'electron'
import { channels } from './API'
import ProjectManager from './ProjectManager/ProjectManager'
import AppUtils from './Utils/AppUtils'
import path from 'path'
import { Logger } from './Logger'
import SpawnHelper from './Utils/SpawnHelper'

export class ArticyManager {
    private mainWindow!: MainWindow
    private static path = `${AppUtils.getResPath()}plugins/ArticyDraft/ArticyDraft.exe`
    private static instance: ArticyManager

    private constructor() { }

    public static getInstance() {
        return ArticyManager.instance || (ArticyManager.instance = new ArticyManager())
    }

    public init(window: MainWindow) {
        ipcMain.handle(channels.toMain.openArticyEditor, this.openEditorAndDisableWindow.bind(this))
        this.mainWindow = window
    }

    public static get articyPath() {
        return ArticyManager.path
    }

    public async exportToUnity(outputPath: string) {
        return new Promise<void>((resolve) => {
            try {
                const pwd = ProjectManager.getInstance().presentWorkingDirectory
                const assetPath = path.join(outputPath, 'Assets')
                const command = `${ArticyManager.path} -export -path ${pwd} -output ${assetPath}`
                const proc = SpawnHelper.spawn(command, [], {
                    shell: true,
                    detached: true,
                }, 'Articy Export')
                proc.on('exit', () => {
                    resolve()
                })
            } catch (e) {
                Logger.get().logVerbose(`Error exporting Articy project: ${e}`)
                resolve()
            }

        })
    }

    private async openEditorAndDisableWindow() {
        this.mainWindow.disableMenuOptionsOnArticyOpened()
        await this.openArticyEditor()
    }

    private async openArticyEditor() {
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const articyStartCommend = `${ArticyManager.path} -edit -path ${pwd}`
        const art = SpawnHelper.spawn(articyStartCommend, [], {
            shell: true,
            detached: true,
        }, 'Articy Editor')

        art.on('exit', () => {
            this.mainWindow.enableMenuOptionsOnArticyClosed()
        });
    }
}
