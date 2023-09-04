import { ipcMain } from 'electron'
import { channels } from './API'
import ProjectManager from './ProjectManager/ProjectManager'
import { FileUtils } from './Utils/FileUtils'
import PreferencesManager from './Preferences/PreferencesManager'
import fetch from 'node-fetch'
import fs from 'fs'
import { StringSetting } from '../frontend/src/@types/Settings'
import Utils from './BuildSystem/Utils'


export class AvatarManager {
    private presentWorkingDirectory: string | undefined
    private avatarServerUrl: string | undefined
    

    public constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {
            this.presentWorkingDirectory = ProjectManager.getInstance().presentWorkingDirectory
            const avatarServerUrlSetting: StringSetting = await PreferencesManager.getInstance().get('avatarServer')
            this.avatarServerUrl = avatarServerUrlSetting.value
            FileUtils.ensurePathExists(this.presentWorkingDirectory + '/Avatars')
        })
        
        ipcMain.handle(channels.toMain.downloadAvatar, async (event, avatarToken) => {
            if(!this.isReady()) return 2
            const errorCode = await this.downloadAvatar(avatarToken)
            if(errorCode !== 0) return errorCode
            await this.extractAvatar(avatarToken)
            await this.deleteZip(avatarToken)
            return 0
        })
        
        ipcMain.handle(channels.toMain.deleteAvatarFromFileSystem, async (event, args) => {
            if(!this.isReady()) return 2
            const path = `${this.presentWorkingDirectory}/Avatars/${args}.zip`
            await fs.promises.rm(path)
        })
    }

    private async downloadAvatar(avatarToken: string) {
        try {
            const destination = `${this.presentWorkingDirectory}/Avatars/${avatarToken}.zip`
            const response = await fetch(`${this.avatarServerUrl}/scans/download`, {
                headers: {
                    'x-scan-id': avatarToken
                }
            })
            const buffer = await response.arrayBuffer()
            await fs.promises.writeFile(destination, Buffer.from(buffer))
        } catch(e) {
            console.log(e)
            return 1
        }
        return 0
    }

    private async extractAvatar(avatarToken: string) {
        const zipPath = `${this.presentWorkingDirectory}/Avatars/${avatarToken}.zip`
        const destination = `${this.presentWorkingDirectory}/Avatars/${avatarToken}`
        FileUtils.ensurePathExists(destination)
        await Utils.extractZipToPath(zipPath, destination)
    }
    
    private async deleteZip(avatarToken: string) {
        const zipPath = `${this.presentWorkingDirectory}/Avatars/${avatarToken}.zip`
        await fs.promises.rm(zipPath)
    }

    private isReady() {
        return this.presentWorkingDirectory !== undefined && this.avatarServerUrl !== undefined
    }
}