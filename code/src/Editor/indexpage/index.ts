// import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

// Hot reloading
try {
    require('electron-reloader')(module)
} catch (_) {}

const $spoke = $('#iframe-spoke').contents()
const $$ = (query) => $spoke.find(query)


$('#btn-test').on('click', () => {
    const $exportGlb = $$('#app nav nav nav div:eq(5)')
    $exportGlb.hide()
    $exportGlb.trigger('click')
})
