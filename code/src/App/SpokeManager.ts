import {ipcMain as ipc} from 'electron'
import * as child_process from 'child_process'
import AppUtils from './AppUtils'


export default class SpokeManager {
    private static instance: SpokeManager
    private startCommand: string = `cd ${AppUtils.getResPath()}/plugins/Spoke && yarn start`
    private spoke: child_process.ChildProcess
    private static pid: number


    public static getInstance(): SpokeManager {
        if(!SpokeManager.instance) {
            SpokeManager.instance = new SpokeManager()
        }
        return SpokeManager.instance
    }

    private constructor() {
        // if(app.isPackaged){
        this.spoke = child_process.spawn(this.startCommand, [], {
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
        console.log('Stop Spoke')
        // console.log('Stopping spoke with pid: ' + SpokeManager.pid)
        // SpokeManager.spoke.kill()
    }
}
