import {$$, htmlElement} from './Spoke'
import SceneLoadingPage from './SceneLoadingPage'

export default class {
    constructor() {
        const handleSceneEditorPage = async() => {
            // TODO: Possible timeout issue -> add event listener instead of polling
            await htmlElement('button:contains("Publish Scene...")')
            const backToScenesButton =  $$('div:contains("Back to Projects"):last')
            backToScenesButton.text('Back to Scenes')
            backToScenesButton.on('click', () => {
                new SceneLoadingPage()
                handleSceneEditorPage()
            })
        }
        // handleSceneEditorPage()
    }
}
