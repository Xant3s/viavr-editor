import {ipcRenderer as ipc} from 'electron'

const btnSelectUnity = document.getElementById('btn-select-unity-path')
const btnConfirmUnityPath = document.getElementById('btn-confirm-unity-path')
const btnQueryPackages = document.getElementById('btn-query-packages')
const btnCreateProject = document.getElementById('btn-create-project')
const btnBuildProject = document.getElementById('btn-build-project')
const unityPathText = document.getElementById('unity-path') as HTMLInputElement
const packageList = document.getElementById('package-list') as HTMLDivElement


btnConfirmUnityPath?.addEventListener('click', () => {
    const unityPath = unityPathText?.value
    ipc.send('set-unity-path', unityPath)
    if(unityPath !== undefined)
        (btnCreateProject as HTMLInputElement).disabled = false
    console.log('SET UNITY PATH')
})

btnSelectUnity?.addEventListener('click', () => ipc.send('select-unity-path'))
btnQueryPackages?.addEventListener('click', () => ipc.send('query-available-packages'))
btnCreateProject?.addEventListener('click', () => ipc.send('create-unity-project', getSelectedPackages()))
btnBuildProject?.addEventListener('click', () => ipc.send('build-unity-project'))

ipc.on('selected-unity-path', (_, unityPath) => unityPathText.value = unityPath ?? unityPathText.value)

ipc.on('clear-packages', () => packageList.innerHTML = '')

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
    packageList.appendChild(label)

    if(p.mandatory) {
        checkbox.checked = true
        checkbox.disabled = true
    }
})

function getSelectedPackages() {
    const checkboxes = Array.from(document.getElementsByClassName('package-select-checkbox'))
    const packages = new Map<string, boolean>()
    checkboxes.forEach(checkbox => packages.set(checkbox.id, (checkbox as HTMLInputElement).checked))
    return packages
}

ipc.on('ready-to-build-project', () => {
    (btnBuildProject as HTMLInputElement).disabled = false
})
