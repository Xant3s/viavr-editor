import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import net from 'net' // Import the net module for TCP connections
import http from 'http' // Import HTTP module for checking the port

export default class ViavrServicesManager {
    private static instance: ViavrServicesManager
    private reticulumPSInstace: child_process.ChildProcess | null = null
    private nearsparkPSInstace: child_process.ChildProcess | null = null

    public static getInstance(): ViavrServicesManager {
        if(!ViavrServicesManager.instance) {
            ViavrServicesManager.instance = new ViavrServicesManager()
        }
        return ViavrServicesManager.instance
    }

    private constructor() {
        this.startVIAVRServices()
        app.on('quit', this.killProcess.bind(this))
    }

    private async startVIAVRServices() {

        //Reticulum
        const scriptPath = `${AppUtils.getResPath()}plugins/viavr-reticulum/run_reticulum_without_checks.ps1`
        const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "${scriptPath}"`

        this.reticulumPSInstace = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
            cwd: `${AppUtils.getResPath()}plugins/viavr-reticulum`,
        })

        // Start monitoring Reticulum's port (localhost:4000)
        this.monitorReticulumService()

        // NearSpark
        const nearSparkScriptPath = `${AppUtils.getResPath()}plugins/viavr-nearspark/`
        const nearSparkPsCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "cd '${nearSparkScriptPath}'; node app.js"`

        this.nearsparkPSInstace = child_process.spawn(nearSparkPsCommand, {
            shell: true,
            detached: true,
            cwd: nearSparkScriptPath, // Optional since we're explicitly setting the directory in the command
        })
    }

    //Monitor Reticulum startup
    private async monitorReticulumService() {
        const MAX_RETRIES = 2 // Maximum retries before restarting the service
        const CHECK_INTERVAL = 2000 // 2 seconds
        const WAIT_BEFORE_CHECK = 5000 // 5 seconds before starting checks

        let retries = 0

        // Wait before starting the checks
        await new Promise((resolve) => setTimeout(resolve, WAIT_BEFORE_CHECK))

        const interval = setInterval(async () => {
            const isReachable = await this.checkPort(4000, 'localhost')
            if(isReachable) {
                console.log('Reticulum is running on localhost:4000')
                retries = 0 // Reset retries if the service is reachable
                clearInterval(interval)
            } else {
                retries++
                console.warn(`Reticulum not reachable. Retry ${retries}/${MAX_RETRIES}`)
                if(retries >= MAX_RETRIES) {
                    console.error('Reticulum service failed. Restarting...')
                    clearInterval(interval) // Stop checking

                    // Restart the service
                    this.restartReticulumService()
                }
            }
        }, CHECK_INTERVAL)
    }

    private restartReticulumService() {
        console.log('Restarting Reticulum service...')
        if(this.reticulumPSInstace && this.reticulumPSInstace.pid) {
            kill(this.reticulumPSInstace.pid, 'SIGKILL', (err) => {
                if(err) {
                    console.error('Failed to kill Reticulum process:', err)
                }
                this.reticulumPSInstace = null
                // Restart the service
                this.startVIAVRServices()
            })
        }
    }

    private checkPort(port: number, host = 'localhost'): Promise<boolean> {
        return new Promise((resolve) => {
            const socket = new net.Socket()
            socket.setTimeout(1000) // Timeout after 1 second

            // Resolve true if the connection succeeds
            socket.connect(port, host, () => {
                socket.destroy() // Close the socket
                resolve(true)
            })

            // Resolve false if there’s an error or timeout
            socket.on('error', () => {
                socket.destroy()
                resolve(false)
            })
            socket.on('timeout', () => {
                socket.destroy()
                resolve(false)
            })
        })
    }


    private killProcess() {
        if(this.reticulumPSInstace) {
            const pid = this.reticulumPSInstace.pid
            if(pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if(err) {
                        console.error('Retciulum kill failed', err)
                    }
                })
            }
            console.log('Reticulum with pid', pid, 'killed')
            this.reticulumPSInstace = null
        }
        if(this.nearsparkPSInstace) {
            const pid = this.nearsparkPSInstace.pid
            if(pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if(err) {
                        console.error('Nearspark kill failed', err)
                    }
                })
            }
            console.log('Nearspark with pid', pid, 'killed')
            this.nearsparkPSInstace = null
        }
    }
}
