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
    }

    private static createWindow() {
        const win = new BrowserWindow({
            width: 1000,
            height: 700,
            webPreferences: {
                nodeIntegration: true
            }
        });

        // win.loadFile('src/indexpage/index.html');
        win.loadFile('https://localhost:9090');
        win.webContents.openDevTools();
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
