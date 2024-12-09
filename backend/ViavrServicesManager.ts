import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'
import net from 'net' // Import the net module for TCP connections
import http from 'http' // Import HTTP module for checking the port

export default class ViavrServicesManager {
    private static instance: ViavrServicesManager
    private reticulumPSInstance: child_process.ChildProcess | null = null
    private nearsparkPSInstance: child_process.ChildProcess | null = null
    private MAX_RETICULUM_CHECKS = 3;
    private CURRENT_RETICULUM_CHECKS = 0;

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
        // Kill `erl.exe` if running (effectifly kills every running reticulum instance)
        await this.killErlProcess();
        this.killNearSparkProcessIfAble(); //just to prevent spawning unnessecary NearSpark instances if something goes wrong

        //Reticulum
        const scriptPath = `${AppUtils.getResPath()}plugins/viavr-reticulum/run_reticulum_without_checks.ps1`
        const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "${scriptPath}"`

        this.reticulumPSInstance = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
            cwd: `${AppUtils.getResPath()}plugins/viavr-reticulum`,
        })

        // Start monitoring Reticulum's port (localhost:4000)
        this.monitorReticulumService()

        // NearSpark
        const nearSparkScriptPath = `${AppUtils.getResPath()}plugins/viavr-nearspark/`
        const nearSparkPsCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "cd '${nearSparkScriptPath}'; node app.js"`

        this.nearsparkPSInstance = child_process.spawn(nearSparkPsCommand, {
            shell: true,
            detached: true,
            cwd: nearSparkScriptPath, // Optional since we're explicitly setting the directory in the command
        })
    }

    //Monitor Reticulum startup
    private async monitorReticulumService() {
        if(this.CURRENT_RETICULUM_CHECKS >= this.MAX_RETICULUM_CHECKS)
        {
            console.log("Tryed to restart reticulum " + this.MAX_RETICULUM_CHECKS + " times. Aborting reticulum checks please try to reinstall/check Reticulum installation.")
            return;
        }
        this.CURRENT_RETICULUM_CHECKS++;
        
        const MAX_RETRIES = 2 // Maximum retries before restarting the service
        const CHECK_INTERVAL = 4000 // 2 seconds
        const WAIT_BEFORE_CHECK = 8000 // 5 seconds before starting checks

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

    private killProcess() 
    {
        if(this.reticulumPSInstance) {
            const pid = this.reticulumPSInstance.pid
            if(pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if(err) {
                        console.error('Reticulum kill failed', err)
                    }
                })
            }
            console.log('Reticulum with pid', pid, 'killed')
            this.reticulumPSInstance = null
        }
        if(this.nearsparkPSInstance) {
            const pid = this.nearsparkPSInstance.pid
            if(pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if(err) {
                        console.error('Nearspark kill failed', err)
                    }
                })
            }
            console.log('Nearspark with pid', pid, 'killed')
            this.nearsparkPSInstance = null
        }
    }

    private killNearSparkProcessIfAble()
    {
        if(this.nearsparkPSInstance) {
            const pid = this.nearsparkPSInstance.pid
            if(pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if(err) {
                        console.error('Nearspark kill failed', err)
                    }
                })
            }
            console.log('Nearspark with pid', pid, 'killed')
            this.nearsparkPSInstance = null
        }
    }

    private restartReticulumService() {
        console.log('Restarting Reticulum service...')
        if(this.reticulumPSInstance && this.reticulumPSInstance.pid) {
            kill(this.reticulumPSInstance.pid, 'SIGKILL', (err) => {
                if(err) {
                    console.error('Failed to kill Reticulum process:', err)
                }
                this.reticulumPSInstance = null
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

    private async killErlProcess(): Promise<void> {
        //Just to make sure if Reticulum gets stuck in any way that this will resolve the Problem
        return new Promise((resolve) => {
            const psCommand = `powershell -Command "Get-Process erl -ErrorAction SilentlyContinue | Stop-Process -Force"`;
    
            child_process.exec(psCommand, (error, stdout, stderr) => {
                if (error) {
                    //Expected fail if no instance of erl.exe is running
                }
                resolve(); // Resolve the promise after the command finishes
            });
        });
    }
}
