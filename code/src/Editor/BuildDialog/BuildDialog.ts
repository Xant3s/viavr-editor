import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')


class BuildDialog {
    private readonly buildButton = $('#btn-build-project')
    private readonly packageList = document.getElementById('package-list') as HTMLDivElement
    private readonly sceneList = $('#scene-list').get()[0] as HTMLDivElement
    private readonly openProjectButton = $('#btn-open-build-directory')

    constructor() {
        $('#btn-query-packages').on('click', () => this.queryPackages())
        $('#btn-create-project').on('click', () => ipc.send('create-unity-project', this.getSelectedPackages()))
        this.buildButton.on('click', () => ipc.send('build-unity-project'))
        this.openProjectButton.on('click', () => ipc.send('open-build-directory'))

        ipc.on('add-package', (_, p) => this.addPackage(p))
        ipc.on('ready-to-build-project', () => this.buildButton.prop('disabled', false))
        ipc.on('build-finished', () => this.openProjectButton.prop('disabled', false))
        ipc.on('display-available-scenes', (e, scenes) => this.displayAvailableScenes(scenes))
        this.queryPackages()
        this.queryScenes()
    }

    private queryPackages() {
        this.packageList.innerHTML = ''
        ipc.send('query-available-packages')
    }

    private queryScenes() {
        this.sceneList.innerHTML = ''
        ipc.send('query-available-scenes')
    }

    private addPackage(p) {
        const label = document.createElement('label')
        const description = document.createTextNode(p.displayName)
        const versionContainer = document.createElement('span')
        const checkbox = document.createElement('input')
        const br = document.createElement('br')
        checkbox.type = 'checkbox'
        checkbox.title = label.title = p.description
        checkbox.classList.add('package-select-checkbox')
        checkbox.id = p.name
        versionContainer.style.color = 'gray'
        versionContainer.appendChild(document.createTextNode(' ' + p.version))
        label.appendChild(checkbox)
        label.appendChild(description)
        label.appendChild(versionContainer)
        label.appendChild(br)
        this.packageList.appendChild(label)

        if(p.mandatory) {
            checkbox.checked = true
            checkbox.disabled = true
        }
    }

    private getSelectedPackages() {
        const checkboxes = Array.from(document.getElementsByClassName('package-select-checkbox'))
        const packages = new Map<string, boolean>()
        checkboxes.forEach(checkbox => packages.set(checkbox.id, (checkbox as HTMLInputElement).checked))
        return packages
    }

    private displayAvailableScenes(scenes) {
        console.log('display')
        scenes.forEach(sceneName => {
            const label = document.createElement('label')
            const description = document.createTextNode(sceneName)
            const checkbox = document.createElement('input')
            const br = document.createElement('br')
            checkbox.type = 'checkbox'
            checkbox.classList.add('scene-select-checkbox')
            checkbox.id = sceneName
            label.appendChild(checkbox)
            label.appendChild(description)
            label.appendChild(br)
            this.sceneList.appendChild(label)
        })
    }
}

new BuildDialog()
