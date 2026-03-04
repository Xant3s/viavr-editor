import { app } from 'electron'
import { ChildProcess } from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import { checkPort } from './Utils/CheckPort'
import SpawnHelper from './Utils/SpawnHelper'

export default class ViavrServicesManager {
    private static instance: ViavrServicesManager
    private reticulumPSInstance: ChildProcess | null = null
    private nearsparkPSInstance: ChildProcess | null = null
    private verdaccioPSInstance: ChildProcess | null = null
    private MAX_RETICULUM_CHECKS = 3
    private CURRENT_RETICULUM_CHECKS = 0

    public static getInstance(): ViavrServicesManager {
        if (!ViavrServicesManager.instance) {
            ViavrServicesManager.instance = new ViavrServicesManager()
        }
        return ViavrServicesManager.instance
    }

    private constructor() {
        this.startReticulum()
        this.startNearSpark()
        this.startVerdaccio()
    }

    private async startReticulum() {
        await this.killErlProcess() // Kill `erl.exe` if running (effectively kills every running reticulum instance)

        const scriptPath = `${AppUtils.getResPath()}plugins/viavr-reticulum/run_reticulum_without_checks.ps1`

        this.reticulumPSInstance = SpawnHelper.spawn(
            'powershell',
            ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
            {
                shell: true,
                cwd: `${AppUtils.getResPath()}plugins/viavr-reticulum`,
            },
            'Reticulum'
        )

        // Start monitoring Reticulum's port (localhost:4000)
        await this.monitorReticulumService()
    }

    private startNearSpark() {
        const nearSparkScriptPath = `${AppUtils.getResPath()}plugins/viavr-nearspark/`

        this.nearsparkPSInstance = SpawnHelper.spawn('node', ['app.js'], {
            shell: true,
            cwd: nearSparkScriptPath,
        }, 'NearSpark')
    }

    private startVerdaccio() {
        const verdaccioPath = `${AppUtils.getResPath()}plugins/verdaccio-package-registry/`
        console.log(verdaccioPath)
        this.verdaccioPSInstance = SpawnHelper.spawn('npm', ['run', 'verdaccio'], {
            shell: true,
            cwd: verdaccioPath,
        }, 'Verdaccio')
    }

    private async monitorReticulumService() {
        if (this.CURRENT_RETICULUM_CHECKS >= this.MAX_RETICULUM_CHECKS) {
            console.log('Tried to restart reticulum ' + this.MAX_RETICULUM_CHECKS + ' times. Aborting reticulum checks please try to reinstall/check Reticulum installation.')
            return
        }
        this.CURRENT_RETICULUM_CHECKS++

        const MAX_RETRIES = 2 // Maximum retries before restarting the service
        const CHECK_INTERVAL = 5000 * this.CURRENT_RETICULUM_CHECKS // 5 seconds interval increased by current check
        const WAIT_BEFORE_CHECK = 8000 // 8 seconds before starting checks

        let retries = 0

        // Wait before starting the checks
        await new Promise((resolve) => setTimeout(resolve, WAIT_BEFORE_CHECK))

        const interval = setInterval(async () => {
            const isReachable = await checkPort(4000, 'localhost')
            if (isReachable) {
                console.log('Reticulum is running on localhost:4000')
                retries = 0 // Reset retries if the service is reachable
                clearInterval(interval)
            } else {
                retries++
                console.warn(`Reticulum not reachable. Retry ${retries}/${MAX_RETRIES}`)
                if (retries >= MAX_RETRIES) {
                    console.error('Reticulum service failed. Restarting...')
                    clearInterval(interval) // Stop checking

                    // Restart the service
                    await this.killProcess(this.reticulumPSInstance, 'Reticulum')
                    this.reticulumPSInstance = null
                    await this.startReticulum()
                }
            }
        }, CHECK_INTERVAL)
    }

    public async stopAllChildProcesses(): Promise<void> {
        console.log('Stopping all VIA-VR services...')
        await Promise.all([
            this.killProcess(this.reticulumPSInstance, 'Reticulum'),
            this.killProcess(this.nearsparkPSInstance, 'NearSpark'),
            this.killProcess(this.verdaccioPSInstance, 'Verdaccio')
        ])
        this.reticulumPSInstance = null
        this.nearsparkPSInstance = null
        this.verdaccioPSInstance = null
        console.log('All VIA-VR services stopped.')
    }

    private async killProcess(process: ChildProcess | null, name: string): Promise<void> {
        if (!process) return
        await SpawnHelper.killTree(process, name)
    }

    private async killErlProcess(): Promise<void> {
        //Just to make sure if Reticulum gets stuck in any way that this will resolve the Problem
        return new Promise((resolve) => {
            const psCommand = `powershell -Command "Get-Process erl -ErrorAction SilentlyContinue | Stop-Process -Force"`

            SpawnHelper.exec(psCommand, (error) => {
                if (error) {
                    //Expected fail if no instance of erl.exe is running
                }
                resolve() // Resolve the promise after the command finishes
            })
        })
    }
}
