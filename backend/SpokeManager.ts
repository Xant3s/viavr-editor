import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import PreferencesManager from './Preferences/PreferencesManager'

export default class SpokeManager {
    private static instance: SpokeManager
    private spokeProcess : child_process.ChildProcess | undefined = undefined


    public static getInstance(): SpokeManager {
        if(!SpokeManager.instance) {
            SpokeManager.instance = new SpokeManager()
        }
        return SpokeManager.instance
    }

    private constructor() {
        this.startSpoke()
        app.on('quit', this.stopSpoke.bind(this))
    }

    private async startSpoke() {
        const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden yarn start`
        this.spokeProcess = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
            cwd: `${AppUtils.getResPath()}plugins/Spoke`
        })
    }

    private async stopSpoke() {
        const shouldStop: boolean = await PreferencesManager.getInstance().get<boolean>('dev.stopSpoke') as boolean

        if(app.isPackaged || shouldStop) {
            if(this.spokeProcess && this.spokeProcess.pid) kill(this.spokeProcess.pid)
        }
    }
}
