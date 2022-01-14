import {BrowserWindow} from 'electron'


export default class Main {
    static mainWindow: Electron.BrowserWindow
    static application: Electron.App
    static BrowserWindow

    static main(application: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow
        Main.application = application
        Main.application.whenReady().then(Main.createWindow)
        Main.application.on('activate', Main.activate)
        Main.application.on('window-all-closed', Main.onWindowAllClosed)
    }

    private static createWindow() {
        const win = new BrowserWindow({
            width: 1000,
            height: 700,
            webPreferences: {
                nodeIntegration: true,
            }
        })

        win.loadFile('src/indexpage/index.html')
        win.webContents.openDevTools()

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

    private static activate() {
        if(BrowserWindow.getAllWindows().length === 0) {
            Main.createWindow()
        }
    }

    private static onWindowAllClosed() {
        if(process.platform !== 'darwin') {
            Main.application.quit()
        }
    }
}
