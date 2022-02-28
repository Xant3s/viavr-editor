import {$$, htmlElement} from './Spoke'

export default class SceneLoadingPage {
    private title!: JQuery<HTMLElement>

    constructor() {
        const init = async() => {
            this.title = await htmlElement('h1:contains("Projects"):last')
            await this.onShowSceneLoadingPage()
        }
        init()
    }

    private async onShowSceneLoadingPage() {
        this.title.text('Scenes')
        $$('a:contains("New Project"):first').text('New Scene')
        $$('h3:contains("New Project"):last').text('New Scene')
        $$('a:contains("Login"):last').parent().hide()
        $$('a:contains("Source"):first').parent().parent().hide()
    }
}
