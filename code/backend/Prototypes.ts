import {BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import * as isDev from 'electron-is-dev'

export class Prototypes {
    constructor() {
        ipcMain.on('dev:open-panels-prototype', () => this.openPanels())
        ipcMain.on('dev:open-tabs-prototype', () => this.openTabs())
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
                    preload: path.join(__dirname, '../preload.js')
                }
            }
        )
        if(isDev) {
            panels.loadURL('http://localhost:3000#/panels-prototype')
        } else {
            panels.loadURL(`file://${__dirname}/../index.html#/panels-prototype`)
        }
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
                    preload: path.join(__dirname, '../preload.js')
                }
            }
        )
        if(isDev) {
            tabs.loadURL('http://localhost:3000#/panels-prototype')
        } else {
            tabs.loadURL(`file://${__dirname}/../index.html#/panels-prototype`)
        }
    }
}
