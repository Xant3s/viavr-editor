import { toaster } from 'evergreen-ui'
import { SpokeAPI } from './SpokeAPI'


export class SceneExport {
    constructor() {
        api.on(api.channels.fromMain.spokeExportScene, () => SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.saveScene))
        api.on(api.channels.fromMain.spokeProjectSavedSuccessfully, async () => await this.showSaveSuccessToaster())
        api.on(api.channels.fromMain.saveProjectInProgress, async () => await this.showSaveInfoToaster())
    }

    private async showSaveSuccessToaster() {
        const language = await api.invoke(api.channels.toMain.getDefinitiveLanguage)
        const message = language === 'de' ? 'Das Projekt wurde erfolgreich gespeichert.'  : 'Project has been saved successfully'
        toaster.success(message, { duration: 10 })
    }

    private async showSaveInfoToaster() {
        const language = await api.invoke(api.channels.toMain.getDefinitiveLanguage)
        const message = language === 'de' ? 'Das Projekt wird gespeichert, bitte warten...' : 'Saving project, please wait...'
        toaster.notify(message, { duration: 10 })
    }
}
