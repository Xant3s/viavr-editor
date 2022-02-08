import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch (_) {}




ipc.on('spoke:export-scene', () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)

    // const $exportGlb = $$('#app nav nav nav div:eq(5)')
    const $exportGlb = $$('div:contains("Export as binary glTF"):last')
    $exportGlb.hide()
    setInterval(foo, 100)
    $exportGlb.trigger('click')
})

const foo = () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)

    const $exportProjectBtn = $$('button:contains("Export Project")')
    // console.log($exportProjectBtn === undefined)
    // console.log($exportProjectBtn.length)
    if($exportProjectBtn.length > 0) {
        const $form = $exportProjectBtn.closest('form')
        $form.hide()
        $exportProjectBtn.last().trigger('click')
        // TODO: stop loop
    }

    const $exportingProjectProgressbarSpan = $$('span:contains("Exporting Project"):last')
    if($exportingProjectProgressbarSpan.length > 0) {
        $exportingProjectProgressbarSpan.text('Exporting Scene...')
        $$('div:contains("project"):last').text('Exporting scene...')
    }
}
// setInterval(foo, 500)
