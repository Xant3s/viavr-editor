import {BrowserWindow, ipcMain, ipcMain as ipc, nativeTheme} from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
import CustomMenu from './CustomMenu'
import {channels} from './API'



export default class MainWindow {
    private static window: Electron.BrowserWindow
    private application: Electron.App


    public constructor(application: Electron.App) {
        this.application = application
        this.application.whenReady().then(MainWindow.createWindow)
        this.application.on('activate', MainWindow.activate)
        this.application.on('window-all-closed', () => MainWindow.onWindowAllClosed(application))
        this.application.on('quit', () => ipc.emit('app:quit'))

        // https://github.com/electron/electron/issues/18214
        this.application.commandLine.appendSwitch('disable-site-isolation-trials')
    }

    get window(): Electron.BrowserWindow {
        return MainWindow.window
    }

    public send(channel: string, ...args: any[]) {
        MainWindow.window.webContents.send(channel, ...args)
    }

    private static createWindow() {
        MainWindow.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                preload: path.join(__dirname, 'preload.js')
            }
        })

        MainWindow.allowCertificatesFromLocalhost(MainWindow.window)
        new CustomMenu().loadCustomMenu()

        if (isDev) {
            MainWindow.window.loadURL('http://localhost:3000')
        } else {
            MainWindow.window.loadURL(`file://${__dirname}/../index.html`)
        }

        MainWindow.window.maximize()

        ipcMain.on(channels.toMain.setDarkMode, (_, val) => nativeTheme.themeSource = val.toLowerCase())

        // Hot Reloading
        if (isDev) {
            // 'node_modules/.bin/electronPath'
            require('electron-reload')(__dirname, {
                electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
                forceHardReset: true,
                hardResetMethod: 'exit'
            })
        }

        // DevTools
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err))

        if(isDev) {
            MainWindow.window.webContents.openDevTools()
        }
    }

    private static activate() {
        if(BrowserWindow.getAllWindows().length === 0) {
            MainWindow.createWindow()
        }
    }

    private static onWindowAllClosed(app: Electron.App) {
        if(process.platform !== 'darwin') {
            app.quit()
        }
    }

    private static allowCertificatesFromLocalhost(win: Electron.BrowserWindow) {
        // https://stackoverflow.com/questions/63923644/self-signed-certificates-in-electron
        win.webContents.session.setCertificateVerifyProc((request, callback) => {
            const {hostname} = request
            console.log(hostname)
            if(hostname === 'localhost') { // this is blind trust, however you should use the certificate, valdiatedcertifcate, verificationresult as your verification point to call callback
                callback(0) // Trust this domain
            } else {
                callback(-3) // Use chromium's verification result
            }
        })
    }
}
