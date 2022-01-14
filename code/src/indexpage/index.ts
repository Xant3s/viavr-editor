import {ipcRenderer as ipc} from 'electron'

const btnTest = document.getElementById('btn-test')

btnTest?.addEventListener('click', () => {
    ipc.send('test')
})
