import { ipcMain } from 'electron'
import { channels } from './API'
import ProjectManager from './ProjectManager/ProjectManager'
import { FileUtils } from './Utils/FileUtils'
import PreferencesManager from './Preferences/PreferencesManager'
import fetch from 'node-fetch'
import fs from 'fs'
import { StringSetting } from '../frontend/src/@types/Settings'

export class AvatarManager {
    public constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(() => {
            FileUtils.ensurePathExists(ProjectManager.getInstance().presentWorkingDirectory + '/Avatars')
        })
        
        ipcMain.handle(channels.toMain.downloadAvatar, async (event, args) => {
            try {
                const avatarServerUrlSetting: StringSetting = await PreferencesManager.getInstance().get('avatarServer')
                const avatarServerUrl = avatarServerUrlSetting.value
                const destination = `${ProjectManager.getInstance().presentWorkingDirectory}/Avatars/${args}.zip`
                const response = await fetch(`${avatarServerUrl}/scans/download`, {
                    headers: {
                        'x-scan-id': args
                    }
                })
                const buffer = await response.arrayBuffer()
                await fs.promises.writeFile(destination, Buffer.from(buffer))
            } catch(e) {
                console.log(e)
                return 1
            }
            return 0
        })
    }
}