import {BrowserView, BrowserWindow, ipcMain as ipc} from 'electron'

export default class HelloWorld {
    constructor() {
        ipc.on('test', () => HelloWorld.printHelloWorld())
    }

    private static printHelloWorld() {
        console.log('Hello World!')

        // const {BrowserView} = require('electron')
        const win = new BrowserWindow({width: 800, height: 600})
        const view = new BrowserView()
        win.setBrowserView(view)
        view.setBounds({x: 0, y: 0, width: 800, height: 600})
        view.webContents.loadURL('https://localhost:9090')
    }
}

