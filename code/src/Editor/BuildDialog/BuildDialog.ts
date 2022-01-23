import {ipcRenderer as ipc} from 'electron'

class BuildDialog {
    readonly btnSelectUnity = document.getElementById('btn-select-unity-path')
    readonly btnConfirmUnityPath = document.getElementById('btn-confirm-unity-path')
    readonly btnQueryPackages = document.getElementById('btn-query-packages')
    readonly btnCreateProject = document.getElementById('btn-create-project')
    readonly btnBuildProject = document.getElementById('btn-build-project')
    readonly unityPathText = document.getElementById('unity-path') as HTMLInputElement
    readonly packageList = document.getElementById('package-list') as HTMLDivElement

    constructor() {
        this.btnConfirmUnityPath?.addEventListener('click', () => {
            const unityPath = this.unityPathText?.value
            ipc.send('set-unity-path', unityPath)
            if(unityPath !== undefined)
                (this.btnCreateProject as HTMLInputElement).disabled = false
            console.log('SET UNITY PATH')
        })

        this.btnSelectUnity?.addEventListener('click', () => ipc.send('select-unity-path'))
        this.btnQueryPackages?.addEventListener('click', () => ipc.send('query-available-packages'))
        this.btnCreateProject?.addEventListener('click', () => ipc.send('create-unity-project', this.getSelectedPackages()))
        this.btnBuildProject?.addEventListener('click', () => ipc.send('build-unity-project'))


        ipc.on('selected-unity-path', (_, unityPath) => this.unityPathText.value = unityPath ?? this.unityPathText.value)

        ipc.on('clear-packages', () => this.packageList.innerHTML = '')

        ipc.on('add-package', (_, p) => {
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
        })

        ipc.on('ready-to-build-project', () =>
            (this.btnBuildProject as HTMLInputElement).disabled = false)
    }

    private getSelectedPackages() {
        const checkboxes = Array.from(document.getElementsByClassName('package-select-checkbox'))
        const packages = new Map<string, boolean>()
        checkboxes.forEach(checkbox => packages.set(checkbox.id, (checkbox as HTMLInputElement).checked))
        return packages
    }

}

new BuildDialog()
