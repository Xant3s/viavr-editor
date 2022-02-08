import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch (_) {}


const $$ = (query: string) => {
    const $spoke = $('#iframe-spoke').contents()
    return $spoke.find(query)
}

ipc.on('spoke:export-scene', () => {
    const exportSceneButton = $$('div:contains("Export as binary glTF"):last')
    exportSceneButton.hide()
    waitUntilAvailable(exportButton, (btn) => handleExportOptionsDialog(btn), 100)
    exportSceneButton.trigger('click')
})

const exportButton = () => {
    const exportProjectBtnQuery = $$('button:contains("Export Project"):last')
    const isAvailable = exportProjectBtnQuery.length > 0
    return [isAvailable, exportProjectBtnQuery]
}

const exportProcessDialogTitle = () => {
    const dialogTitleQuery = $$('span:contains("Exporting Project"):last')
    const isAvailable = dialogTitleQuery.length > 0
    return [isAvailable, dialogTitleQuery]
}

function handleExportOptionsDialog(exportProjectBtn) {
    exportProjectBtn.closest('form').hide()
    exportProjectBtn.trigger('click')
    waitUntilAvailable(exportProcessDialogTitle, (dialogTitle) => handleExportProgressDialog(dialogTitle), 100)
}

function handleExportProgressDialog(dialogTitle) {
    dialogTitle.text('Exporting Scene...')
    $$('div:contains("project"):last').text('Exporting scene...')
}

const waitUntilAvailable = (predicate, callback, updateTimeInMs: number = 100) => {
    const checkIfAvailable = () => {
        const [found, result] = predicate()
        if(found) {
            clearInterval(intervalId)
            callback(result)
        }
    }

    const intervalId = setInterval(checkIfAvailable, updateTimeInMs)
}
