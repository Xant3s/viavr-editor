import { app } from 'electron'
import * as child_process from 'child_process'
import kill from 'tree-kill'
import AppUtils from './Utils/AppUtils'

export default class ViavrServicesManager {
    private static instance: ViavrServicesManager
    private reticulumPSInstace: child_process.ChildProcess | null = null 
    private nearsparkPSInstace: child_process.ChildProcess | null = null

    public static getInstance(): ViavrServicesManager 
    {
        if(!ViavrServicesManager.instance) 
        {
            ViavrServicesManager.instance = new ViavrServicesManager()
        }
        return ViavrServicesManager.instance
    }

    private constructor() 
    {
        this.startVIAVRServices()
        app.on('quit', this.killProcess.bind(this))
    }

    private async startVIAVRServices() {
        
        //Reticulum
        const scriptPath = `${AppUtils.getResPath()}plugins/viavr-reticulum/run_Windows_Reticulum.ps1`;
        const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "${scriptPath}"`;
        
        this.reticulumPSInstace = child_process.spawn(psCommand, {
            shell: true,
            detached: true,
            cwd: `${AppUtils.getResPath()}plugins/viavr-reticulum`
        })
        // NearSpark
        const nearSparkScriptPath = `${AppUtils.getResPath()}plugins/viavr-nearspark/`;
        const nearSparkPsCommand = `powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "cd '${nearSparkScriptPath}'; node app.js"`;

        this.nearsparkPSInstace = child_process.spawn(nearSparkPsCommand, {
            shell: true,
            detached: true,
            cwd: nearSparkScriptPath, // Optional since we're explicitly setting the directory in the command
        });
    }

    private killProcess()
    {
        if(this.reticulumPSInstace)
        {
            const pid = this.reticulumPSInstace.pid;
            if(pid)
            {
                kill(pid, "SIGKILL", (err) =>
                    {if(err){
                            console.error("Retciulum kill failed",err);
                        }
                    })
            }
            console.log("Reticulum with pid", pid, "killed");
            this.reticulumPSInstace = null;
        }
        if(this.nearsparkPSInstace)
            {
                const pid = this.nearsparkPSInstace.pid;
                if(pid)
                {
                    kill(pid, "SIGKILL", (err) =>
                        {if(err){
                                console.error("Nearspark kill failed",err);
                            }
                        })
                }
                console.log("Nearspark with pid", pid, "killed");
                this.nearsparkPSInstace = null;
        }
    }
}
