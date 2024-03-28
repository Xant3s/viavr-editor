import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import PreferencesManager from './Preferences/PreferencesManager'
import { Logger } from './Logger'

export default class SpokeManager {
    private static instance: SpokeManager
    private startCommand = `cd ${AppUtils.getResPath()}plugins/Spoke && yarn start`
    private spoke!: child_process.ChildProcess


    public static getInstance(): SpokeManager {
        if(!SpokeManager.instance) {
            SpokeManager.instance = new SpokeManager()
        }
        return SpokeManager.instance
    }

    private constructor() {
        this.startSpoke()
        app.on('quit', this.stopSpoke)
    }

    private startSpoke() {
        const psCommand = `powershell -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c ${this.startCommand.replace(/"/g, '`"')}' -WindowStyle Hidden"`
        this.spoke = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
        })
        this.spoke.on('error', (error) => {
            Logger.get().logVerbose(`Spoke process error: ${error}`)
        })
        this.spoke.on('exit', (code, signal) => {
            if (code !== null) {
                Logger.get().logVerbose(`Spoke process exited with code ${code}. Perhaps another Spoke process was already running?`)
            } else if (signal !== null) {
                Logger.get().logVerbose(`Spoke process killed with signal ${signal}.`)
            } else {
                Logger.get().log(`Spoke process exited`)
            }
        })
    }

    private async stopSpoke() {
        const shouldStop: boolean = await PreferencesManager.getInstance().get<boolean>('dev.stopSpoke') as boolean

        if(app.isPackaged || shouldStop) {
            kill(SpokeManager.getInstance().spoke.pid ?? 0)
        }
    }
}
