import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import * as os from 'os'
import PreferencesManager from './Preferences/PreferencesManager'
import { PathSetting } from '../frontend/src/@types/Settings'
import { exec } from 'child_process'

export class Logger {
    private static instance: Logger
    private lines: string[] = []
    
    
    private constructor() {
        this.logSystemInfo()
    }
    
    public static get(): Logger {
        if (!this.instance) {
            this.instance = new Logger()
        }
        return this.instance
    }
    
    public log(message: string): void {
        this.lines.push(message)
    }
    
    public logVerbose(message: string): void {
        console.log(message)
        this.lines.push(message)
    }

    public async save(filePath: string | undefined = undefined) {
        const logPath = filePath ?? path.join(app.getPath('userData'), 'build_log.txt')
        await fs.promises.writeFile(logPath, this.lines.join('\n'))
    }

    private async logSystemInfo() {
        this.logCommitHash()
        const isPackaged = app.isPackaged
        const hostname = os.hostname()
        const processorName = os.cpus()[0].model
        const memoryInGB = Math.round(os.totalmem() / 1024 / 1024 / 1024)
        const availableMemoryInGB = Math.round(os.freemem() / 1024 / 1024 / 1024)
        const pathSetting = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityPath = pathSetting.value
        const picoSdkPathPref: PathSetting = await PreferencesManager.getInstance().get('picoSdkPath')
        const picoSdkPath = picoSdkPathPref.value
        const picoSdkManifest = await JSON.parse(fs.readFileSync(picoSdkPath, 'utf8'))
        const picoSdkVersion = picoSdkManifest.version
        this.log(`Packaged: ${isPackaged}`)
        this.log(`Hostname: ${hostname}`)
        this.log(`Processor: ${processorName}`)
        this.log(`Memory: ${memoryInGB} GB`)
        this.log(`Available memory: ${availableMemoryInGB} GB`)
        this.log(`Unity path: ${unityPath}`)
        this.log(`Pico SDK path: ${picoSdkPath}`)
        this.log(`Pico SDK version: ${picoSdkVersion}`)
        this.log('-----------------------')
        // was spoke running
    }
    
    private logCommitHash() {
        exec('git rev-parse HEAD', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Git command: ${error}`)
                return
            }
            const commitHash = stdout.trim()
            this.log(`Commit hash: ${commitHash}`)
        })
    }
}