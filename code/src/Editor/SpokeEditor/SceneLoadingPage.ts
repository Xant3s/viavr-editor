import {$$, htmlElement} from './Spoke'
import {ipcRenderer} from 'electron'
import * as Path from 'path'
import ProjectManager from '../../App/ProjectManager/ProjectManager'


export default class SceneLoadingPage {
    private title!: JQuery<HTMLElement>

    constructor() {
        const handleSceneLoadingPage = async() => {
            // TODO: Possible timeout issue -> add event listener instead of polling
            this.title = await htmlElement('h1:contains("Projects"):last')
            await this.onShowSceneLoadingPage()
        }
        handleSceneLoadingPage()
    }

    private async onShowSceneLoadingPage() {
        this.updateUILabels()
        await this.displayAvailableScenes()
    }

    private updateUILabels() {
        this.title.text('Scenes')
        const newSceneButton = $$('a:contains("New Project"):first')
        newSceneButton.text('New Scene')
        $$('h3:contains("New Project"):last').text('New Scene')
        $$('a:contains("Login"):last').parent().hide()
        $$('a:contains("Source"):first').parent().parent().hide()

        newSceneButton.on('click', async() => await this.onShowCreateNewScenePage())
        $$('h3:contains("New Scene"):last').parent().on('click', async() =>
            await this.onShowCreateNewScenePage())
    }

    private async displayAvailableScenes() {
        const newSceneLabel = $$('h3:contains("New Scene")')
        const sceneLoadButton = newSceneLabel.parent()
        const availableScenes: string[] = await ipcRenderer.invoke('query-available-json-scenes')
        availableScenes.forEach(sceneName => this.addLoadSceneButton(sceneName, sceneLoadButton))
    }

    private addLoadSceneButton(sceneName: string, newSceneButton: JQuery<HTMLElement>) {
        const sceneNameWithoutExtension = Path.parse(sceneName).name
        const newButton = newSceneButton.clone()
        newButton.find('svg').hide()
        newButton.find('h3').text(sceneNameWithoutExtension)
        newButton.attr('href', '#')
        newButton.on('click', async() => this.loadScene(sceneName, newSceneButton))
        newButton.insertAfter(newSceneButton)
    }

    private async loadScene(sceneName: string, newSceneButton: JQuery<HTMLElement>) {
        console.log(sceneName)
        // TODO: load scene
        // create new empty scene
        $$('h3:contains("New Scene"):last').trigger('click')
        const newEmptySceneBtn = await htmlElement('h3:contains("New Empty Scene"):last')
        newEmptySceneBtn.trigger('click')

        // load legacy json
        const importBtn = await htmlElement('div:contains("Import legacy"):last')
        importBtn.trigger('click')
        await htmlElement('div:contains("Warning! This will overwrite your existing scene"):last')
        $$('button:contains("Ok"):last').trigger('click')

        // handle open file dialog

    }

    private async onShowCreateNewScenePage() {
        // TODO: Possible timeout issue -> add event listener instead of polling
        await htmlElement('a:contains("Back to projects"):last')
        $$('h1:contains("New Project"):last').text('New Scene')
        $$('a:contains("Back to projects"):first').text('Back to scenes')
        $$('a:contains("New Empty Project"):first').text('New Empty scene')
        $$('a:contains("Import From Blender"):first').hide()
        $$('a:contains("Login"):last').parent().hide()
        $$('a:contains("Source"):first').parent().parent().hide()
        const newEmptySceneButton = await htmlElement('h3:contains("New Empty Project"):first')
        newEmptySceneButton.text('New Empty Scene')
    }
}
