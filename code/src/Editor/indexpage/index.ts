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

ipc.on('spoke:export-scene', () => {
    const $exportGlb = $$('div:contains("Export as binary glTF"):last')
    $exportGlb.hide()
    // setInterval(handleExportOptionsDialog, 100)
    waitUntilAvailable(exportButton, (btn) => handleExportOptionsDialog(btn), 100)


    $exportGlb.trigger('click')
})

const waitUntilAvailable = (predicate, callback, updateTimeInMs: number = 100) => {
    const checkIfAvailable = () => {
        console.log('loop')
        const [found, result] = predicate()
        if(found) {
            clearInterval(intervalId)
            callback(result)
        }
    }

    const intervalId = setInterval(checkIfAvailable, updateTimeInMs)
}

// const handleExportOptionsDialog = () => {
//     const $spoke = $('#iframe-spoke').contents()
//     const $$ = (query) => $spoke.find(query)
//     console.log('loop')
//
//     // Export options dialog
//     const $exportProjectBtn = $$('button:contains("Export Project")')
//     if($exportProjectBtn.length > 0) {
//         const $form = $exportProjectBtn.closest('form')
//         $form.hide()
//         $exportProjectBtn.last().trigger('click')
//         // TODO: stop loop
//     }
//
//     // Export progress dialog
//     const $exportingProjectProgressbarSpan = $$('span:contains("Exporting Project"):last')
//     if($exportingProjectProgressbarSpan.length > 0) {
//         $exportingProjectProgressbarSpan.text('Exporting Scene...')
//         $$('div:contains("project"):last').text('Exporting scene...')
//     }
// }
