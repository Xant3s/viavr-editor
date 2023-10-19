import { app, BrowserWindow,  ipcMain as ipc } from 'electron'
import * as path from 'path'
import CustomMenu from './CustomMenu'
import { loadPage } from './Utils/ElectronUtils'
import electron_reload from 'electron-reload'
import { API, channels } from './API'

export default class MainWindow {
    private static window: Electron.BrowserWindow

    public constructor() {
        app.whenReady().then(MainWindow.createWindow)
        app.on('activate', MainWindow.activate)
        app.on('window-all-closed', () => MainWindow.onWindowAllClosed(app))
        app.commandLine.appendSwitch('disable-site-isolation-trials') // https://github.com/electron/electron/issues/18214
        ipc.handle(API.channels.toMain.exitApplication, this.exitApplication.bind(this))
        ipc.on('editor:try-exit', () =>  MainWindow.window.webContents.send(API.channels.fromMain.tryExitApplication))
    }

    get window(): Electron.BrowserWindow {
        return MainWindow.window
    }

    public enableMenuOptionsOnProjectOpened() {
        const menu = new CustomMenu()
        menu.unlockMenuOptionsUponProjectOpened()
    }

    public disableMenuOptionsOnArticyOpened(){
        this.send(channels.fromMain.externalWindowOpened)
        const menu = new CustomMenu()
        menu.lockMenuOptionsUponArticyOpened()
    }

    public enableMenuOptionsOnArticyClosed(){
        this.send(channels.fromMain.externalWindowClosed)
        const menu = new CustomMenu()
        menu.unlockMenuOptionsUponArticyClosed()
    }

    public send(channel: string, ...args: any[]) {
        MainWindow.window.webContents.send(channel, ...args)
    }

    private exitApplication(){
        // @ts-ignore
        MainWindow.window = null
        app.exit(0)
    }

    private static createWindow() {
        MainWindow.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                preload: path.join(__dirname, 'preload.js'),
            },
        })
        MainWindow.window.on("close", () =>
        {
            console.log("Trying to quit")
            MainWindow.window.webContents.send(API.channels.fromMain.tryExitApplication)}
        )
        MainWindow.allowCertificatesFromLocalhost(MainWindow.window)
        new CustomMenu().loadCustomMenu()
        loadPage(MainWindow.window, 'index')
        MainWindow.window.maximize()
        MainWindow.window.webContents.openDevTools()
        if (!app.isPackaged) {
            electron_reload(__dirname, {
                electron: path.join(__dirname, '../../node_modules/.bin/electron'),
                forceHardReset: true,
                hardResetMethod: 'exit',
            })
        }
    }

    private static activate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            MainWindow.createWindow()
        }
    }

    private static onWindowAllClosed(app: Electron.App) {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }

    private static allowCertificatesFromLocalhost(win: Electron.BrowserWindow) {
        // https://stackoverflow.com/questions/63923644/self-signed-certificates-in-electron
        win.webContents.session.setCertificateVerifyProc((request, callback) => {
            const { hostname } = request
            if (hostname === 'localhost') {
                // this is blind trust, however you should use the certificate, valdiatedcertifcate, verificationresult as your verification point to call callback
                callback(0) // Trust this domain
            } else {
                callback(-3) // Use chromium's verification result
            }
        })
    }
}
