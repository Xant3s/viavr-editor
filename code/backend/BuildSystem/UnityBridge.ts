import PreferencesManager from '../Preferences/PreferencesManager'
const util = require('util')

const exec = util.promisify(require('child_process').exec)


export default class UnityBridge {
    public async build(projectPath: string) {
        await this.invokeUnityMethod('de.jmu.ge.viavr.UnityBridge.Core.UnityBridge.ExecuteAll', projectPath)
    }

    private async invokeUnityMethod(method: string, projectPath: string) {
        const unityPath = PreferencesManager.getInstance().get<string>('unityPath')
        const unityAppPath = UnityBridge.isMacOS()? `${unityPath}/Contents/MacOS/Unity` : `${unityPath}`
        const command = `"${unityAppPath}" -quit -batchmode -projectPath "${projectPath}" -executeMethod ${method}`
        const {stdout, stderr } = await exec(command)
        if(stderr) console.log(stderr)
        console.log(stdout)
    }

    private static isMacOS = () => process.platform === 'darwin';
}
