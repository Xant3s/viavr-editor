import {app, ipcMain as ipc} from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './AppUtils'
import PreferencesManager from './Preferences/PreferencesManager'

export default class SpokeManager {
    private static instance: SpokeManager
    private startCommand: string = `cd ${AppUtils.getResPath()}/plugins/Spoke && yarn start`
    private spoke!: child_process.ChildProcess


    public static getInstance(): SpokeManager {
        if(!SpokeManager.instance) {
            SpokeManager.instance = new SpokeManager()
        }
        return SpokeManager.instance
    }

    private constructor() {
        this.startSpoke()
        ipc.on('app:quit', this.stopSpoke)
    }

    private startSpoke() {
        this.spoke = child_process.spawn(this.startCommand, [], {
            shell: true,
            detached: true,
        })
    }

    private stopSpoke() {
        const shouldStop: boolean = PreferencesManager.getInstance().get<boolean>('dev.stopSpoke') as boolean

        if(app.isPackaged || shouldStop) {
            kill(SpokeManager.getInstance().spoke.pid ?? 0)
        }
    }
}
