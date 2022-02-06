import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch (_) {}


// const $spoke = $('#iframe-spoke').contents()
// const $$ = (query) => $spoke.find(query)



ipc.on('spoke:export-scene', () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)

    const $exportGlb = $$('#app nav nav nav div:eq(5)')
    $exportGlb.hide()
    $exportGlb.trigger('click')
})

$('#btn-test').on('click', () => {
    const $spoke = $('#iframe-spoke').contents()
    const $$ = (query) => $spoke.find(query)

    const $exportGlb = $$('#app nav nav nav div:eq(5)')
    $exportGlb.hide()
    $exportGlb.trigger('click')
})
