import { $$ } from './Spoke'
import { SpokeAPI } from './SpokeAPI'


export default class SceneLoadingPage {

    constructor() {
        SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.projectPageSelected, this.displayAvailableScenes.bind(this))
        this.displayAvailableScenes()
    }

    private async displayAvailableScenes() {
        const newSceneLabel = $$('h3:contains("New Scene")')
        const sceneLoadButton = newSceneLabel.parent()
        const availableScenes: string[] = await api.invoke(api.channels.toMain.queryJsonScenes)
        availableScenes.forEach(sceneName => this.addLoadSceneButton(sceneName, sceneLoadButton))
    }

    private addLoadSceneButton(sceneName: string, newSceneButton: JQuery<HTMLElement>) {
        const sceneNameWithoutExtension = api.Path.parse(sceneName).name
        const newButton = newSceneButton.clone()
        newButton.find('svg').hide()
        newButton.find('h3').text(sceneNameWithoutExtension)
        newButton.attr('href', '#')
        newButton.on('click', async () => this.loadScene())
        newButton.insertAfter(newSceneButton)
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
