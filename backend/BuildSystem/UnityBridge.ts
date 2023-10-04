import PreferencesManager from '../Preferences/PreferencesManager'
import { PathSetting } from '../../frontend/src/@types/Settings'
import { spawn } from 'child_process'
import { Logger } from '../Logger'


export default class UnityBridge {
    public async build(projectPath: string) {
        try {
            Logger.get().log('UnityBridge.ExecuteAll')
            await this.invokeUnityMethod('de.jmu.ge.viavr.UnityBridge.Core.UnityBridge.ExecuteAll', projectPath)
        } catch (err) {
            Logger.get().logVerbose(err as string)
            try{
                Logger.get().log('UnityBridge.ExecuteAll')
                await this.invokeUnityMethod('de.jmu.ge.viavr.UnityBridge.Core.UnityBridge.ExecuteAll', projectPath)
            } catch(e) {
                console.log('failed again', e)
            }
        }
    }
    
    public async buildOnly(projectPath: string) {
        try {
            await this.invokeUnityMethod('de.jmu.ge.BuildUtils.BuildManager.BuildPico', projectPath)
        } catch (err) {
            Logger.get().logVerbose(err as string)
        }
    }

    public async openProject(projectPath: string) {
        const args = ['-quit', '-batchmode', '-projectPath', projectPath]
        try {
            Logger.get().log('Opening Unity project to import everything...')
            await this.runUnity(args)   // Just open the project and quit.
            Logger.get().log(`Unity successfully opened the project.`)
        } catch(e) {
            try {
                Logger.get().logVerbose('Expected error on opening Unity project for the first time, retrying...')
                await this.runUnity(args)   // Just open the project and quit.
                Logger.get().log(`Unity successfully opened the project.`)
            } catch(e) {
                Logger.get().logVerbose('Failed opening Unity project again, aborting.')
                console.error(e)
                return
            }
        }
    }

    private async invokeUnityMethod(method: string, projectPath: string) {
        const args = ['-quit', '-batchmode', '-projectPath', projectPath, '-executeMethod', method]
        await this.runUnity(args)
    }
    
    private async runUnity(args: string[]) {
        const unityAppPath = await this.getUnityPath()
        return new Promise<void>((resolve, reject) => {
            const childProcess = spawn(unityAppPath, args)
            childProcess.on('exit', (code, signal) => {
                if(code === 0) {
                    resolve()
                } else {
                    reject(new Error(`Unity exited with code ${code}`))
                }
            })
            childProcess.on('error', (err) => {
                reject(err)
            })
        })
    }

    private async getUnityPath() {
        const pathSetting = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityPath = pathSetting.value
        return UnityBridge.isMacOS() ? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
    }

    private static isMacOS = () => process.platform === 'darwin'
}
