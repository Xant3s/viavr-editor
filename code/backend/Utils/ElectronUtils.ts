export const loadPage = (window: Electron.BrowserWindow, page: string) => {
    window.loadURL(`file://${__dirname}/../../index.html#/${page}`)
}
