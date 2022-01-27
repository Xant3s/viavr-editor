import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')
import {IpcService} from '../IpcService'

const ipcService = new IpcService()

class Preferences {
    constructor() {
        this.loadInitialValues()

        const unityPathQuery = $('#unity-path')
        this.addUpdatePreferencesEvent<string>(unityPathQuery, 'unityPath')
        this.addUpdatePreferencesEvent<string>($('#package-registry-name'), 'packageRegistryName')
        this.addUpdatePreferencesEvent<string>($('#package-registry-url'), 'packageRegistryUrl')
        this.addUpdatePreferencesEvent<string>($('#package-registry-scope'), 'packageRegistryScope')

        $('#btn-select-unity-path').on('click', async () => ipc.send('select-unity-path'))
        $('#btn-toggle-dark-mode').on('click', async () => Preferences.toggleDarkMode())
        $('#btn-toggle-dark-mode-reset').on('click', async () => Preferences.setDarkMode('System'))

        ipc.on(`preference-changed-from-backend-unityPath`, (_, data) => unityPathQuery.val(data))
    }

    private loadInitialValues() {
        this.loadPreference($('#unity-path'), 'unityPath')
        this.loadPreference($('#package-registry-name'), 'packageRegistryName')
        this.loadPreference($('#package-registry-url'), 'packageRegistryUrl')
        this.loadPreference($('#package-registry-scope'), 'packageRegistryScope')
        this.loadPreference($('#theme-source'), 'darkMode').then(value => {
            $('#theme-source').text(value)
            if(value === 'System') ipc.send('dark-mode:system')
            else ipc.send('dark-mode:set', value)
        })
    }

    private async loadPreference(queryElement: JQuery<HTMLElement>, name: string): Promise<string> {
        const data = await ipcService.send<string>('preferences-request',
            {
                responseChannel: `preferences-response-${name}`,
                params: [name]
            })
        queryElement.val(data)
        return data
    }

    private addUpdatePreferencesEvent<Type>(queryElement: JQuery<HTMLElement>, name: string = 'packageRegistryName') {
        queryElement.on('change', async () => {
            ipc.send('preferences-changed', {
                name: name,
                value: queryElement.val()
            })
        })
    }

    private static async toggleDarkMode() {
        const isDarkMode = await ipc.invoke('dark-mode:toggle')
        $('#theme-source').text(isDarkMode ? 'Dark' : 'Light')
        ipc.send('preferences-changed', {
            name: 'darkMode',
            value: isDarkMode ? 'Dark' : 'Light'
        })
    }

    private static setDarkMode(value: string) {
        ipc.send('dark-mode:set', value)
        $('#theme-source').text(value)
        ipc.send('preferences-changed', {
            name: 'darkMode',
            value: value
        })
    }
}

new Preferences()

