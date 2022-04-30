import {ipcMain as ipc} from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './AppUtils'

export default class SpokeManager {
    private static instance: SpokeManager
    private startCommand: string = `cd ${AppUtils.getResPath()}/plugins/Spoke && yarn start`
    private spoke: child_process.ChildProcess


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
        ipc.on('app-quit', this.stopSpoke)
        // }
    }

    private stopSpoke() {
        kill(SpokeManager.getInstance().spoke.pid)
    }
}
