import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')


class BuildDialog {
    private readonly buildButton = $('#btn-build-project')
    private readonly unityPathText = document.getElementById('unity-path') as HTMLInputElement
    private readonly packageList = document.getElementById('package-list') as HTMLDivElement

    constructor() {
        $('#btn-select-unity-path').on('click', () => ipc.send('select-unity-path'))
        $('#btn-confirm-unity-path').on('click', () => this.setUnityPath())
        $('#btn-query-packages').on('click', () => ipc.send('query-available-packages'))
        $('#btn-create-project').on('click', () => ipc.send('create-unity-project', this.getSelectedPackages()))
        this.buildButton.on('click', () => ipc.send('build-unity-project'))

        ipc.on('selected-unity-path', (_, unityPath) => this.unityPathText.value = unityPath ?? this.unityPathText.value)
        ipc.on('clear-packages', () => this.packageList.innerHTML = '')
        ipc.on('add-package', (_, p) => this.addPackage(p))
        ipc.on('ready-to-build-project', () => this.buildButton.prop('disabled', false))

        ipc.send('query-available-packages')
    }

    private setUnityPath() {
        const unityPath = this.unityPathText?.value
        ipc.send('set-unity-path', unityPath)
        if(unityPath !== undefined)
            $('#btn-create-project').prop('disabled', false)
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
}

new BuildDialog()
