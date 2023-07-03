import { BrowserWindow, ipcMain } from 'electron'
import { loadPage } from './Utils/ElectronUtils'

export class Prototypes {
    constructor() {
        ipcMain.handle('dev:open-panels-prototype', () => this.openPanels())
        ipcMain.handle('dev:open-tabs-prototype', () => this.openTabs())
    }

    private async openPanels() {
        const panels = new BrowserWindow(
            {
                width: 900,
                height: 900,
                modal: true,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true,
                },
            },
        )
        loadPage(panels, 'panels-prototype')
    }

    private async openTabs() {
        const tabs = new BrowserWindow(
            {
                width: 900,
                height: 900,
                modal: true,
                autoHideMenuBar: true,
                webPreferences: {
                    nodeIntegration: true,
                },
            },
        )
        loadPage(tabs, 'tabs-prototype')
    }
}
