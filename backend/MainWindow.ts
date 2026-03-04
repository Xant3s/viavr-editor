import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import * as path from 'path'
import CustomMenu from './CustomMenu'
import { loadPage } from './Utils/ElectronUtils'
import electron_reload from 'electron-reload'
import { API, channels } from './API'
import ProjectManager from './ProjectManager/ProjectManager'

export default class MainWindow {
    private static window: Electron.BrowserWindow
    private static isActuallyQuitting = false

    public constructor() {
        app.whenReady().then(MainWindow.createWindow)
        app.on('activate', MainWindow.activate)
        app.on('window-all-closed', () => MainWindow.onWindowAllClosed(app))
        app.commandLine.appendSwitch('disable-site-isolation-trials') // https://github.com/electron/electron/issues/18214
        ipc.handle(API.channels.toMain.exitApplication, this.exitApplication.bind(this))
        ipc.on('editor:try-exit', () => {
            if (ProjectManager.getInstance().projectIsLoaded()) {
                if (MainWindow.window && !MainWindow.window.isDestroyed()) {
                    MainWindow.window.webContents.send(API.channels.fromMain.tryExitApplication)
                }
            } else {
                this.exitApplication()
            }
        })
    }

    public static getIsActuallyQuitting(): boolean {
        return this.isActuallyQuitting
    }

    get window(): Electron.BrowserWindow {
        return MainWindow.window
    }

    public enableMenuOptionsOnProjectOpened() {
        const menu = new CustomMenu()
        menu.unlockMenuOptionsUponProjectOpened()
    }

    public disableMenuOptionsOnProjectClosed() {
        const menu = new CustomMenu()
        menu.lockMenuOptionsUponProjectClosed()
    }

    public disableMenuOptionsOnArticyOpened() {
        this.send(channels.fromMain.externalWindowOpened)
        const menu = new CustomMenu()
        menu.lockMenuOptionsUponArticyOpened()
    }

    public enableMenuOptionsOnArticyClosed() {
        this.send(channels.fromMain.externalWindowClosed)
        const menu = new CustomMenu()
        menu.unlockMenuOptionsUponArticyClosed()
    }

    public send(channel: string, ...args: any[]) {
        MainWindow.window.webContents.send(channel, ...args)
    }

    private exitApplication() {
        MainWindow.isActuallyQuitting = true
        app.quit()
    }

    private static createWindow() {
        MainWindow.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                preload: path.join(__dirname, 'preload.js'),
            },
            title: `VIA-VR Editor ${app.getVersion()}`
        })
        MainWindow.window.on("close", (event) => {
            // If we are not actually quitting yet and a project is loaded, interrupt the close.
            // This allows the "Save the project?" modal to appear while services are still alive.
            if (!MainWindow.isActuallyQuitting && ProjectManager.getInstance().projectIsLoaded()) {
                event.preventDefault()
                if (MainWindow.window && !MainWindow.window.isDestroyed()) {
                    MainWindow.window.webContents.send(API.channels.fromMain.tryExitApplication)
                }
            }
        })
        MainWindow.allowCertificatesFromLocalhost(MainWindow.window)
        loadPage(MainWindow.window, 'index')
        MainWindow.window.maximize()
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
