import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch(_) {
}


const $$ = (query: string) => {
    const $spoke = $('#iframe-spoke').contents()
    return $spoke.find(query)
}

$('#create-new-project-btn').on('click', () => {
    ipc.send('project-manager:create-new-project')
})

$('#open-project-btn').first().on('click', () => {
    ipc.send('project-manager:open-project')
})

ipc.on('project-manager:project-created', () => onProjectSelected())
ipc.on('project-manager:project-opened', () => onProjectSelected())

function onProjectSelected() {
    $('#project-selection-page').hide()
    $('#spoke-container').show()
}


class SceneExport {
    constructor() {
        ipc.on('spoke:export-scene', async() => {
            const exportSceneButton = $$('div:contains("Export as binary glTF"):last')
            exportSceneButton.hide()
            exportSceneButton.trigger('click')
            const exportButton = await this.htmlElement('button:contains("Export Project"):last')
            await this.handleExportOptionsDialog(exportButton)
        })
    }

    private async handleExportOptionsDialog(exportProjectBtn) {
        exportProjectBtn.closest('form').hide()
        exportProjectBtn.trigger('click')
        const dialogTitle = await this.htmlElement('span:contains("Exporting Project"):last')
        dialogTitle.text('Exporting Scene...')
        $$('div:contains("project"):last').text('Exporting scene...')
    }

    private htmlElement(query: string, updateIntervalInMs: number = 100, timeout: number = 10_000): Promise<JQuery<HTMLElement>> {
        return new Promise((resolve, reject) => {
            const checkIfAvailable = () => {
                const element = $$(query)
                if(element.length > 0) {
                    clearInterval(intervalId)
                    resolve(element.first())
                }
            }

            const intervalId = setInterval(checkIfAvailable, updateIntervalInMs)
            setTimeout(() => {
                clearInterval(intervalId)
                reject(new Error('Timeout'))
            }, timeout)
        })
    }
}

new SceneExport()
