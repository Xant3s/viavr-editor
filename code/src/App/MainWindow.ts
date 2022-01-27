import {BrowserWindow, ipcMain, ipcMain as ipc, nativeTheme} from 'electron'
import CustomMenu from './CustomMenu'
import * as path from 'path'


export default class MainWindow {
    private static window: Electron.BrowserWindow
    private application: Electron.App


    public constructor(application: Electron.App) {
        this.application = application
        this.application.whenReady().then(MainWindow.createWindow)
        this.application.on('activate', MainWindow.activate)
        this.application.on('window-all-closed', () => MainWindow.onWindowAllClosed(application))
        this.application.on('quit', () => ipc.emit('app-quit'))

        // https://github.com/electron/electron/issues/18214
        this.application.commandLine.appendSwitch('disable-site-isolation-trials')
    }

    get window(): Electron.BrowserWindow {
        return MainWindow.window
    }

    private static createWindow() {
        MainWindow.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false
            }
        })

        MainWindow.allowCertificatesFromLocalhost(MainWindow.window)
        new CustomMenu().loadCustomMenu()
        MainWindow.window.loadFile('src/Editor/indexpage/index.html')
        MainWindow.window.maximize()
        MainWindow.window.webContents.openDevTools()


        ipcMain.handle('dark-mode:toggle', () => {
                if(nativeTheme.shouldUseDarkColors) {
                    nativeTheme.themeSource = 'light'
                } else {
                    nativeTheme.themeSource = 'dark'
                }

                return nativeTheme.shouldUseDarkColors
            }
        )

        ipcMain.handle('dark-mode:system', () => nativeTheme.themeSource = 'system')
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
