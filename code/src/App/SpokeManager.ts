import {ipcMain as ipc} from 'electron'

export default class SpokeManager {
    constructor() {
        this.startSpoke()
        ipc.on('app-quit', this.stopSpoke)
    }

    private startSpoke() {
        console.log('Starting Spoke')
    }

    private stopSpoke() {
        console.log('Quitting viavr')
    }
}
