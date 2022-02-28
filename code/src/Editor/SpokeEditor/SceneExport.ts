import {ipcRenderer as ipc} from 'electron'
import {$$, htmlElement} from './Spoke'


export class SceneExport {
    constructor() {
        ipc.on('spoke:export-scene', async() => {
            const exportSceneButton = $$('div:contains("Export as binary glTF"):last')
            exportSceneButton.hide()
            exportSceneButton.trigger('click')
            const exportButton = await htmlElement('button:contains("Export Project"):last')
            await this.handleExportOptionsDialog(exportButton)
        })
    }

    private async handleExportOptionsDialog(exportProjectBtn) {
        exportProjectBtn.closest('form').hide()
        exportProjectBtn.trigger('click')
        const dialogTitle = await htmlElement('span:contains("Exporting Project"):last')
        dialogTitle.text('Exporting Scene...')
        $$('div:contains("project"):last').text('Exporting scene...')
    }
}
