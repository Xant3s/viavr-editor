import {$$, htmlElement} from './Spoke'

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
        this.displayAvailableScenes()
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

    private displayAvailableScenes() {
        const newSceneLabel = $$('h3:contains("New Scene")')
        const sceneLoadButton = newSceneLabel.parent()
        const grid = sceneLoadButton.parent()
        const newButton = sceneLoadButton.clone()
        newButton.find('svg').hide()
        newButton.find('h3').text('Test')
        newButton.attr('href', '#')
        newButton.on('click', async() => {
            console.log('test')
        })
        newButton.insertAfter(sceneLoadButton)
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
