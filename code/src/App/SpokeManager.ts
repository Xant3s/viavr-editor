import {ipcMain as ipc} from 'electron'
import * as child_process from 'child_process'
import AppUtils from './AppUtils'


export default class SpokeManager {
    private app: Electron.App
    private startCommand: string = `cd ${AppUtils.getResPath()}/plugins/Spoke && yarn start`
    private static spoke: child_process.ChildProcess
    private static pid: number


    constructor(app: Electron.App) {
        this.app = app
        // if(app.isPackaged){
        SpokeManager.spoke = child_process.spawn(this.startCommand, [], {
            shell: true,
            detached: true,
        })
        // SpokeManager.pid = SpokeManager.spoke.pid
        ipc.on('app-quit', this.stopSpoke)
        // console.log('Spoke started with pid: ' + SpokeManager.pid)
        // }
    }

    private stopSpoke() {
        // TODO
        // console.log('Stopping spoke with pid: ' + SpokeManager.pid)
        // SpokeManager.spoke.kill()
    }
}
