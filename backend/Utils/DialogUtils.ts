import {ipcMain, dialog} from 'electron'
import {channels} from '../API'


export default class DialogUtils {
    constructor() {
        ipcMain.handle(channels.toMain.showOpenFileDialog, async() => {
                const result = await dialog.showOpenDialog({properties: ['openFile']})
                if(result && !result.canceled) {
                    // TODO: Check if path is valid
                    return result.filePaths[0]
                }
                return undefined
            }
        )
    }
}
