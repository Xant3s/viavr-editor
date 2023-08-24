import { $$ } from './Spoke'
import { SpokeAPI } from './SpokeAPI'


export default class SceneLoadingPage {

    constructor() {
        this.createOrLoadScene()
    }

    private async createOrLoadScene(){
        const availableScenes: string[] = await api.invoke(api.channels.toMain.queryJsonScenes)
        if(availableScenes.length > 0){
            await this.loadScene()
            return
        }
    }
    private async loadScene() {
        const sceneFileContents = await api.invoke(api.channels.toMain.getSceneFileContents)
        if(sceneFileContents === '') {
            console.error('Scene file contents are empty')
            return
        }
        if(!SpokeAPI.Instance.IsReady) {
            console.error('SpokeAPI is not ready')
            return
        }
        SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.loadScene, sceneFileContents)
    }
}
