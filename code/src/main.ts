import {BrowserWindow} from 'electron';


export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    static main(application: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = application;
        Main.application.whenReady().then(Main.createWindow);
        Main.application.on('activate', Main.activate);
        Main.application.on('window-all-closed', Main.onWindowAllClosed);


        // https://stackoverflow.com/questions/63923644/self-signed-certificates-in-electron
        // in your main process, having Electron's `app` imported
        Main.application.on ("certificate-error", (event, webContents, url, error, cert, callback) => {
            // Do some verification based on the URL to not allow potentially malicious certs:
            if (url.startsWith ("https://localhost:")) {
                // Hint: For more security, you may actually perform some checks against
                // the passed certificate (parameter "cert") right here

                event.preventDefault (); // Stop Chromium from rejecting the certificate
                callback (true);         // Trust this certificate
            } else callback (false);     // Let Chromium do its thing
        });
    }

    private static createWindow() {
        const win = new BrowserWindow({
            width: 1000,
            height: 700,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                webviewTag: true,
                contextIsolation: false
            }
        });

        win.loadFile('src/indexpage/index.html');
        // win.loadFile('src/indexpage/test.html');
        // win.loadFile('src/Spoke/src/index.html');
        // win.loadFile('https://localhost:9090');
        win.webContents.openDevTools();

        // https://stackoverflow.com/questions/63923644/self-signed-certificates-in-electron
        // win.webContents.session.setCertificateVerifyProc((request, callback) => {
        //     const { hostname } = request
        //     console.log(hostname)
        //     if (hostname === 'test2.samueltruman.com') { //this is blind trust, however you should use the certificate, valdiatedcertifcate, verificationresult as your verification point to call callback
        //         callback(0); //this means trust this domain
        //     } else {
        //         callback(-3); //use chromium's verification result
        //     }
        // })
    }

    private static activate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            Main.createWindow();
        }
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
}
