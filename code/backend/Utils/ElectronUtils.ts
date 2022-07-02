import * as isDev from 'electron-is-dev'

export const loadPage = (window: Electron.BrowserWindow, page: string) => {
    if(isDev) {
        window.loadURL(`http://localhost:3000#/${page}`)
    } else {
        window.loadURL(`file://${__dirname}/../index.html#/${page}`)
    }
}
