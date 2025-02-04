import { ipcMain } from 'electron'
import { execSync, spawnSync } from 'child_process'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import path from 'path'
import { PathSetting } from '../frontend/src/@types/Settings'

export class AdbUtils {
    private adbPath = ''

    public constructor() {
        (async () => {
            await this.getAdbPath()
        })()

        ipcMain.handle(channels.toMain.adbGetDeviceConnected, async () => await this.getDeviceConnected())
        ipcMain.handle(channels.toMain.adbInstallApk, async (_event, apkPath: string) => await this.installApk(apkPath))
    }

    private async getAdbPath() {
        const unityPathPref = await PreferencesManager.getInstance().get<PathSetting>('unityPath')
        const unityFolder = path.dirname(unityPathPref.value)
        this.adbPath = `"${unityFolder}\\Data\\PlaybackEngines\\AndroidPlayer\\SDK\\platform-tools\\adb.exe"`
    }

    /**
     * Checks whether any Android device is connected.
     *
     * Executes "adb devices" and parses the output.
     * Returns true if any line (after the header) contains a device.
     */
    private async getDeviceConnected() {
        try {
            await this.getAdbPath()
            const result = execSync(`${this.adbPath} devices`, { encoding: 'utf-8' })
            // Example output:
            //   List of devices attached
            //   emulator-5554	device
            const lines = result.split('\n').map(line => line.trim())
            // Skip the first line (header) and check the remaining lines.
            for(let i = 1; i < lines.length; i++) {
                // A valid device line usually ends with 'device'.
                if(lines[i] && lines[i].endsWith('device')) {
                    return true
                }
            }
            return false
        } catch(error) {
            console.error('Error checking connected devices:', error)
            return false
        }
    }

    /**
     * Installs an APK onto the connected device.
     *
     * Runs "adb install -r <apkPath>" to install (or replace) the application.
     * Returns true if the install command indicates success.
     */
    private async installApk(apkPath: string) {
        try {
            await this.getAdbPath()
            const packageName = `com.DefaultCompany.DefaultUnityProject`
            execSync(`${this.adbPath} uninstall ${packageName}`)

            const result = execSync(`${this.adbPath} install -r ${apkPath}`, { encoding: 'utf-8' })
            console.log('ADB install output:', result)
            if(result.includes('Success')) {
                return true
            } else {
                console.error('ADB install did not report success:', result)
                return false
            }
        } catch(error) {
            console.error('Exception during APK installation:', error)
            return false
        }
    }
}
