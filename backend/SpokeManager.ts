import { app } from 'electron'
import { ChildProcess } from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import PreferencesManager from './Preferences/PreferencesManager'
import { checkPort } from './Utils/CheckPort'
import { channels } from './API'
import MainWindow from './MainWindow'
import SpawnHelper from './Utils/SpawnHelper'

export default class SpokeManager {
    private static instance: SpokeManager
    private spokeProcess: ChildProcess | undefined = undefined


    public static getInstance(): SpokeManager {
        if (!SpokeManager.instance) {
            SpokeManager.instance = new SpokeManager()
        }
        return SpokeManager.instance
    }

    private constructor() {
        this.startSpoke()
        app.on('quit', this.stopSpoke.bind(this))
    }

    private async startSpoke() {
        this.spokeProcess = SpawnHelper.spawn('yarn', ['start'], {
            shell: true,
            cwd: `${AppUtils.getResPath()}plugins/Spoke`
        })
    }

    private async stopSpoke() {
        const shouldStop: boolean = await PreferencesManager.getInstance().get<boolean>('dev.stopSpoke') as boolean

        if (app.isPackaged || shouldStop) {
            if (this.spokeProcess && this.spokeProcess.pid) kill(this.spokeProcess.pid)
        }
    }

    public waitForSpokePort(mainWindow: MainWindow) {
        const interval = setInterval(async () => {
            const portBlocked = await checkPort(9090)
            if (portBlocked) {
                clearInterval(interval)
                mainWindow.send(channels.fromMain.spokePortTaken)
            }
        }, 100)
    }
}
