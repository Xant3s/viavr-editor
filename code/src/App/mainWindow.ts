import {BrowserWindow} from 'electron'
import CustomMenu from './CustomMenu'

export let mainWindow : BrowserWindow;

export default class MainWindow {
    static window: Electron.BrowserWindow
    static application: Electron.App


    static main(application: Electron.App) {
        MainWindow.application = application
        MainWindow.application.whenReady().then(MainWindow.createWindow)
        MainWindow.application.on('activate', MainWindow.activate)
        MainWindow.application.on('window-all-closed', MainWindow.onWindowAllClosed)

        // https://github.com/electron/electron/issues/18214
        MainWindow.application.commandLine.appendSwitch('disable-site-isolation-trials')
    }

    private static createWindow() {
        mainWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
            }
        })

        MainWindow.allowCertificatesFromLocalhost(mainWindow)
        new CustomMenu().loadCustomMenu()
        mainWindow.loadFile('src/Editor/indexpage/index.html')
        mainWindow.maximize()
        mainWindow.webContents.openDevTools()
    }

    private static activate() {
        if(BrowserWindow.getAllWindows().length === 0) {
            MainWindow.createWindow()
        }
    }

    private static onWindowAllClosed() {
        if(process.platform !== 'darwin') {
            MainWindow.application.quit()
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
