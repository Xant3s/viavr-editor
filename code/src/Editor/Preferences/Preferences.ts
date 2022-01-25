import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')
import {IpcService} from '../IpcService'

const ipcService = new IpcService()

class Preferences {
    constructor() {
        this.loadInitialValues()

        this.addUpdatePreferencesEvent<string>($('#unity-path'), 'unityPath')
        this.addUpdatePreferencesEvent<string>($('#package-registry-name'), 'packageRegistryName')
        this.addUpdatePreferencesEvent<string>($('#package-registry-url'), 'packageRegistryUrl')
        this.addUpdatePreferencesEvent<string>($('#package-registry-scope'), 'packageRegistryScope')

        $('#btn-select-unity-path').on('click', async () => {
        })
    }

    private loadInitialValues() {
        this.loadPreference($('#unity-path'), 'unityPath')
        this.loadPreference($('#package-registry-name'), 'packageRegistryName')
        this.loadPreference($('#package-registry-url'), 'packageRegistryUrl')
        this.loadPreference($('#package-registry-scope'), 'packageRegistryScope')
    }

    private async loadPreference(queryElement: JQuery<HTMLElement>, name: string) {
        const data = await ipcService.send<string>('preferences-request',
            {
                responseChannel: `preferences-response-${name}`,
                params: [name]
            })
        queryElement.val(data)
    }

    private addUpdatePreferencesEvent<Type>(queryElement: JQuery<HTMLElement>, name: string = 'packageRegistryName') {
        queryElement.on('change', async () => {
            ipc.send('preferences-changed', {
                name: name,
                value: queryElement.val()
            })
        })
    }
}

new Preferences()

