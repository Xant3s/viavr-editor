import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch (_) {}




ipc.on('spoke:export-scene', () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)

    const $exportGlb = $$('div:contains("Export as binary glTF"):last')
    $exportGlb.hide()
    // setInterval(handleExportOptionsDialog, 100)
    waitUntilAvailable(() => {
        const exportProjectBtnQuery = $$('button:contains("Export Project")')
        return [exportProjectBtnQuery.length > 0, exportProjectBtnQuery.last()]
    }, (exportProjectBtn) => {
        const form = exportProjectBtn.closest('form')
        form.hide()
        exportProjectBtn.trigger('click')
    }, 100)


    $exportGlb.trigger('click')
})

const waitUntilAvailable = (predicate, callback, updateTimeInMs = 100) => {
    const intervalId = setInterval(() => {
        const [found, result] = predicate()
        if(found) {
            clearInterval(intervalId)
            callback(result)
        }
    }, updateTimeInMs)
}

const handleExportOptionsDialog = () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)
    console.log('loop')

    // Export options dialog
    const $exportProjectBtn = $$('button:contains("Export Project")')
    if($exportProjectBtn.length > 0) {
        const $form = $exportProjectBtn.closest('form')
        $form.hide()
        $exportProjectBtn.last().trigger('click')
        // TODO: stop loop
    }

    // Export progress dialog
    const $exportingProjectProgressbarSpan = $$('span:contains("Exporting Project"):last')
    if($exportingProjectProgressbarSpan.length > 0) {
        $exportingProjectProgressbarSpan.text('Exporting Scene...')
        $$('div:contains("project"):last').text('Exporting scene...')
    }
}
