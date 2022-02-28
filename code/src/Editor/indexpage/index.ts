import {ipcRenderer as ipc} from 'electron'
import {SceneExport} from '../SpokeEditor/SceneExport'
import $ = require('jquery')
import SceneLoadingPage from '../SpokeEditor/SceneLoadingPage'
import SceneEditor from '../SpokeEditor/SceneEditor'

// Hot reloading
try {
    require('electron-reloader')(module)
} catch(_) {
}



$('#create-new-project-btn').on('click', () => {
    ipc.send('project-manager:create-new-project')
})

$('#open-project-btn').first().on('click', () => {
    ipc.send('project-manager:open-project')
})

$('#open-project-folder-btn').first().on('click', () => {
    ipc.send('project-manager:open-project-folder')
})

ipc.on('project-manager:project-created', () => onProjectSelected())
ipc.on('project-manager:project-opened', () => onProjectSelected())

function onProjectSelected() {
    $('#project-selection-page').hide()
    $('#spoke-container').show()
}

new SceneEditor()
new SceneExport()
new SceneLoadingPage()
