import {$$, htmlElement} from './Spoke'

export default class SceneLoadingPage {
    private title!: JQuery<HTMLElement>

    constructor() {
        const handleSceneLoadingPage = async() => {
            this.title = await htmlElement('h1:contains("Projects"):last')
            await this.onShowSceneLoadingPage()
            await htmlElement('a:contains("Back to projects"):last')
            await this.onShowSceneLoadingSelectionPage()
        }
        handleSceneLoadingPage()
    }

    private async onShowSceneLoadingPage() {
        this.title.text('Scenes')
        $$('a:contains("New Project"):first').text('New Scene')
        $$('h3:contains("New Project"):last').text('New Scene')
        $$('a:contains("Login"):last').parent().hide()
        $$('a:contains("Source"):first').parent().parent().hide()
    }

    private async onShowSceneLoadingSelectionPage() {
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
