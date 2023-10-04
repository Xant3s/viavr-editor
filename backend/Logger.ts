import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import * as os from 'os'
import PreferencesManager from './Preferences/PreferencesManager'
import { PathSetting, Setting_t, StringSetting } from '../frontend/src/@types/Settings'
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
        const isPackaged = app.isPackaged
        const hostname = os.hostname()
        const processorName = os.cpus()[0].model
        const memoryInGB = Math.round(os.totalmem() / 1024 / 1024 / 1024)
        const availableMemoryInGB = Math.round(os.freemem() / 1024 / 1024 / 1024)
        const unityPathSetting = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityPath = unityPathSetting.value
        const articyPathSetting = await PreferencesManager.getInstance().get<Setting_t>('articyPath')
        const articyPath = articyPathSetting.value as string
        const picoSdkPathPref: PathSetting = await PreferencesManager.getInstance().get('picoSdkPath')
        const picoSdkPath = picoSdkPathPref.value
        const picoSdkManifest = await JSON.parse(fs.readFileSync(picoSdkPath, 'utf8'))
        const picoSdkVersion = picoSdkManifest.version
        const avatarServerUrlSetting: StringSetting = await PreferencesManager.getInstance().get('avatarServer')
        const avatarServerUrl = avatarServerUrlSetting.value
        await this.logCommitHash()
        await this.logGitHasUncommitedChanges()
        this.log(`Packaged: ${isPackaged}`)
        this.log(`Hostname: ${hostname}`)
        this.log(`Processor: ${processorName}`)
        this.log(`Available memory: ${availableMemoryInGB} GB`)
        this.log(`Memory: ${memoryInGB} GB`)
        this.log(`Unity path: ${unityPath}`)
        this.log(`Articy path: ${articyPath}`)
        this.log(`Avatar server URL: ${avatarServerUrl}`)
        this.log(`Pico SDK path: ${picoSdkPath}`)
        this.log(`Pico SDK version: ${picoSdkVersion}`)
        await this.logDependenciesExist()
        await this.logPackageRegistryOnline()
        this.log('-----------------------')
    }
    
    private logCommitHash(): Promise<void> {
        return new Promise((resolve) => {
            exec('git rev-parse HEAD', (error, stdout, stderr) => {
                if(error) {
                    console.error(`Error executing Git command: ${error}`)
                    resolve()
                }
                const commitHash = stdout.trim()
                this.log(`Commit hash: ${commitHash}`)
                resolve()
            })
        })
    }
    private async logGitHasUncommitedChanges(): Promise<void> {
        return new Promise ((resolve) => {
            exec('git status --porcelain', (error, stdout, stderr) => {
                if(error) {
                    console.error(`Error executing Git command git status --porcelain: ${error}`)
                    resolve()
                }
                const uncommitedChanges = stdout.trim()
                if(uncommitedChanges !== '') {
                    this.log(`Uncommited changes: ${uncommitedChanges}`)
                    resolve()
                } else {
                    console.log('No uncommited changes')
                    resolve()
                }
            })
        })
    }
    
    private async logDependenciesExist() {
        const unityPathSetting = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityPath = unityPathSetting.value
        const articyPathSetting = await PreferencesManager.getInstance().get<Setting_t>('articyPath')
        const articyPath = articyPathSetting.value as string
        const picoSdkPathPref: PathSetting = await PreferencesManager.getInstance().get('picoSdkPath')
        const picoSdkPath = picoSdkPathPref.value

        try {
            await fs.promises.access(unityPath)
            this.log('Unity exists: yes')
        } catch (err) {
            this.log('Unity exists: no')
        }
        try {
            await fs.promises.access(articyPath)
            this.log('Articy exists: yes')
        }
        catch (err) {
            this.log('Articy exists: no')
        }
        try {
            await fs.promises.access(picoSdkPath)
            this.log('Pico SDK exists: yes')
        }
        catch (err) {
            this.log('Pico SDK exists: no')
        }
    }
    
    private async logPackageRegistryOnline() {
        const url = 'https://packages.informatik.uni-wuerzburg.de/de.jmu.ge.buildutils'
        try {
            const response = await fetch(url)
            if (response.status === 200) {
                this.log(`Package registry online: yes (${url})`)
            } else {
                this.log(`Package registry online: no (${url})`)
            }
        } catch(e) {
            this.log(`Package registry online: no (${url})`)
        }
    }
}