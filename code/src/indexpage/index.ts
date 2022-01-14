import {ipcRenderer as ipc} from 'electron'

try {
    require('electron-reloader')(module)
} catch (_) {}

const btnTest = document.getElementById('btn-test')

btnTest?.addEventListener('click', () => {
    ipc.send('test')
})
