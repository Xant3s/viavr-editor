import { toaster } from 'evergreen-ui'
import { SpokeAPI } from './SpokeAPI'


export class SceneExport {
    constructor() {
        api.on(api.channels.fromMain.spokeExportScene, async () => SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.saveScene))
        api.on(api.channels.fromMain.spokeProjectSavedSuccessfully, () => this.showSuccessToaster('Project has been saved successfully'))
        api.on(api.channels.fromMain.saveProjectInProgress, () => this.showInfoToaster('Saving project, please wait...'))
    }

    private showSuccessToaster(message) {
        toaster.success(message, { duration: 10 });
    }
    
    private showInfoToaster(message) {
        toaster.notify(message, { duration: 10 });
    }
}
