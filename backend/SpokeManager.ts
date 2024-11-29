import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import PreferencesManager from './Preferences/PreferencesManager'
import { Logger } from './Logger'
import find from 'find-process'

export default class SpokeManager {
    private static instance: SpokeManager
    private startCommand = `yarn start`
    private port = 9090
    private pids: number[] = []


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
        const foundPids = await this.tryGetSpokePid(this.port)
        this.pids = [...this.pids, ...foundPids]
        
        const psCommand = `powershell -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c ${this.startCommand.replace(/"/g, '`"')}' -WindowStyle Hidden"`
        const powerShellProcess = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
            cwd: `${AppUtils.getResPath()}plugins/Spoke`
        })

        await this.sleep(5_000)  // Workaround. tryGetSpokePid in stopSpoke doesn't seem to work.
        const newPids = await this.tryGetSpokePid(this.port)
        this.pids = [...this.pids, ...newPids]
    }

    private async stopSpoke() {
        const shouldStop: boolean = await PreferencesManager.getInstance().get<boolean>('dev.stopSpoke') as boolean

        if(app.isPackaged || shouldStop) {
            this.pids.forEach(pid => kill(pid))
        }
    }

    private async tryGetSpokePid(port = 9090) {
        try {
            const processes = await find('port', port)
            if(processes.length === 0) return []

            processes.forEach(p => {
                Logger.get().logVerbose(`Process using port ${port}: PID=${p.pid}, Name=${p.name}`)
            })

            return processes.map(p => p.pid)
        } catch(error) {
            Logger.get().logVerbose(`Error finding process by port: ${error}`)
            return []
        }
    }

    private sleep(timeInMs: number) {
        return new Promise<void>((resolve) => setTimeout(() => resolve(), timeInMs))
    }
}
