import PreferencesManager from '../Preferences/PreferencesManager'
import { PathSetting } from '../../frontend/src/@types/Settings'
import { spawn } from 'child_process'


export default class UnityBridge {
    public async build(projectPath: string) {
        try {
            await this.invokeUnityMethod('de.jmu.ge.viavr.UnityBridge.Core.UnityBridge.ExecuteAll', projectPath)
        } catch (err) {
            console.error(err)
        }
    }

    private async invokeUnityMethod(method: string, projectPath: string) {
        const pathSetting = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityPath = pathSetting.value
        const unityAppPath = UnityBridge.isMacOS() ? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
        const args = ['-quit', '-batchmode', '-projectPath', projectPath, '-executeMethod', method]

        return new Promise<void>((resolve, reject) => {
            const childProcess = spawn(unityAppPath, args)
            childProcess.on('exit', (code, signal) => {
                if(code === 0) {
                    resolve()
                } else {
                    reject(new Error(`Child process exited with code ${code}`))
                }
            })
            childProcess.on('error', (err) => {
                reject(err)
            })
        })
    }

    private static isMacOS = () => process.platform === 'darwin'
}
