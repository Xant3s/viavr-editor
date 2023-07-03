import { ipcMain } from 'electron'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import { Setting_t } from '../frontend/src/@types/Settings'
import child_process from 'child_process'
import ProjectManager from './ProjectManager/ProjectManager'

export class ArticyManager {
    public constructor() {
        ipcMain.handle(channels.toMain.openArticyEditor, this.openArticyEditor)
    }

    private async openArticyEditor() {
        const articyPathSetting = await PreferencesManager.getInstance().get<Setting_t>('articyPath')
        const articyPath = articyPathSetting.value as string
        const pwd = ProjectManager.getInstance().presentWorkingDirectory
        const articyStartCommend = `${articyPath} -edit -path ${pwd}`
        child_process.spawn(articyStartCommend, [], {
            shell: true,
            detached: true,
        })
    }
}
