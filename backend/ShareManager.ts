import { ipcMain } from 'electron'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import { Setting_t } from '../frontend/src/@types/Settings'
import ProjectManager from './ProjectManager/ProjectManager'
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

export default class ShareManager {
    constructor() {
        ipcMain.handle(channels.toMain.shareProject, async (_, projectName) => this.shareProject(projectName))
    }

    private async shareProject(projectName: string) {
        const templateServerSetting = (await PreferencesManager.getInstance().get('templateServer')) as Setting_t
        const templateServerAddress = templateServerSetting.value as string
        const projectPath = ProjectManager.getInstance().projectPath
        await ProjectManager.getInstance().saveProject()
        const stats = await fs.promises.stat(projectPath)
        const fileSizeInBytes = stats.size
        const fileStream = await fs.createReadStream(projectPath)

        const formData = new FormData()
        formData.append('file', fileStream, { knownLength: fileSizeInBytes, filename: projectName + '.via' })
        const result = await fetch(`${templateServerAddress}/projects/add`, {
            method: 'POST',
            body: formData,
        })
        return result.status
    }
}
