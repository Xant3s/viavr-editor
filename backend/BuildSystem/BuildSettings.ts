import ProjectManager from '../ProjectManager/ProjectManager'
import ProjectSettingsManager from '../ProjectManager/ProjectSettingsManager'
import { BuildSettingsManager } from './BuildSettingsManager'

export class BuildSettings {
    constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {
            const version = await BuildSettingsManager.getInstance().get('avatars')
            if (!version) {
                const defaultAvatarSetting = { }
                await BuildSettingsManager.getInstance().set('avatars', defaultAvatarSetting)
            }
        })
    }
}