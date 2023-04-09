import ProjectManager from '../ProjectManager/ProjectManager'
import fs from 'fs-extra'
import { ipcMain } from 'electron'
import { channels } from '../API'
import Path from 'path'

export class SceneUtils {
    public static async register() {
        ipcMain.handle(channels.toMain.getSceneObjects, SceneUtils.getSceneObjects)
    }

    // Assumes there is only one scene in the project
    public static async getSceneObjects() {
        const scenesDir = Path.join(ProjectManager.getInstance().presentWorkingDirectory, 'Scenes')
        const files = await fs.readdir(scenesDir)
        const spokeFileName = files.find(file => file.endsWith('.spoke'))
        if (!spokeFileName) return []
        const scene = await fs.readJson(Path.join(scenesDir, spokeFileName as string))
        return Object.entries(scene.entities).map(([key, value]: [string, any]) => ({ ...value, uuid: key }))
    }
}
