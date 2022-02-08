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
    $exportGlb.trigger('click')
})
