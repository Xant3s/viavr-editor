import ProjectManager from './ProjectManager'
import ProjectSettingsManager from './ProjectSettingsManager'
import { app } from 'electron'

export class ProjectTags {
    constructor() {
        ProjectManager.getInstance().registerOnProjectLoadedListener(async () => {
            const version = await ProjectSettingsManager.getInstance().get('dev.viavr.editor.version')
            if (!version) {
                await ProjectSettingsManager.getInstance().set('dev.viavr.editor.version', app.getVersion())
            }
            const tags = await ProjectSettingsManager.getInstance().get('tags')
            if (!tags) {
                const defaultTagSetting = {
                    value: [],
                    uuid: 'eec34978-5532-43b4-ae66-75d3deacc6cf',
                    kind: 'list',
                    listType: 'string',
                    label: 'Project Tags',
                }
                await ProjectSettingsManager.getInstance().set('tags', defaultTagSetting)
            }
        })
    }
}
