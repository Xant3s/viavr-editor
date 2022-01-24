import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')
import {IpcService} from '../IpcService'

const ipcs = new IpcService()

class Preferences {
    constructor() {
        this.addUpdatePreferencesEvent<string>($('#unity-path'), 'unityPath')
        this.addUpdatePreferencesEvent<string>($('#package-registry-name'), 'packageRegistryName')
        this.addUpdatePreferencesEvent<string>($('#package-registry-url'), 'packageRegistryUrl')
        this.addUpdatePreferencesEvent<string>($('#package-registry-scope'), 'packageRegistryScope')

        $('#btn-select-unity-path').on('click', async () => {
            const res = await ipcs.send<string>('preferences-info')
            console.log(res)
        })
    }

    private addUpdatePreferencesEvent<Type>(queryElement: JQuery<HTMLElement>, name: string = 'packageRegistryName') {
        queryElement.on('change', () => {
            ipc.send('preferences-changed', {
                name: name,
                value: queryElement.val()
            })
        })
    }
}

new Preferences()

