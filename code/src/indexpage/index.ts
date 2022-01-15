import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')

try {
    require('electron-reloader')(module)
} catch (_) {}

const btnTest = document.getElementById('btn-test')

btnTest?.addEventListener('click', () => {
    ipc.send('test')


    const spoke = document.getElementById('iframe-spoke') as HTMLIFrameElement
    const h1 = $(spoke).contents().find('h1')
    h1.text('Hello World')

})
