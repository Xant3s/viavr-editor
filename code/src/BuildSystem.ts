import {BrowserWindow, ipcMain as ipc} from 'electron'

export default class BuildSystem {
    constructor() {
        ipc.on('open-build-menu', () => this.openBuildMenu())
    }

    private openBuildMenu(){
        const buildDialog = new BrowserWindow(
            {
                width: 1000,
                height: 700,
                title: "Build Dialog",
                webPreferences: {
                    nodeIntegration: true
                }
            }
        )
        buildDialog.loadFile('src/BuildDialog/BuildDialog.html')
    }
}
