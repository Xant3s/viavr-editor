import {app} from 'electron'

export const loadPage = (window: Electron.BrowserWindow, page: string) => {
    if(app.isPackaged) {
        window.loadURL(`file://${__dirname}/../../index.html#/${page}`)
    } else {
        window.loadURL(`http://localhost:3000#/${page}`)
    }
}
