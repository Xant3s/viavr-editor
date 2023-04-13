import { dialog, ipcMain } from 'electron'
import { channels } from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import { Setting_t } from '../frontend/src/@types/Settings'
import ProjectManager from './ProjectManager/ProjectManager'
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import Path from 'path'

export default class ShareManager {
    constructor() {
        ipcMain.handle(channels.toMain.shareProject, async (_, projectName) => this.shareProject(projectName))
        ipcMain.handle(channels.toMain.downloadProjectTemplates, async () => await this.downloadProjectTemplates())
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
        let status: number
        try {
            const result = await fetch(`${templateServerAddress}/projects/add`, {
                method: 'POST',
                body: formData,
            })
            status = result.status
        } catch {
            status = 503
        }
        return status
    }

    private async downloadProjectTemplates(): Promise<number> {
        const templateServerSetting = (await PreferencesManager.getInstance().get('templateServer')) as Setting_t
        const templateServerAddress = templateServerSetting.value as string
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory'],
        })
        if (!canceled && filePaths.length > 0) {
            const destinationDir = filePaths[0]
            const result = await fetch(`${templateServerAddress}/projects/list`)
            if (result.status !== 200) return result.status
            const templateList = await result.json()
            const downloadPromises = templateList.map(async template => {
                const fileResult = await fetch(`${templateServerAddress}/projects/download?filename=${template}`)
                if (fileResult.status !== 200) return fileResult.status
                const fileBuffer = await fileResult.buffer()
                await fs.promises.writeFile(Path.join(destinationDir, template), fileBuffer)
            })

            const results = await Promise.all(downloadPromises)
            return 200 // Ok
        }
        return 418 // I'm a teapot (user aborted)
    }
}
