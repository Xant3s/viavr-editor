import {ipcRenderer as ipc} from 'electron'
import $ = require('jquery')


class Preferences {
    constructor() {
        this.loadInitialValues()

        const unityPathQuery = $('#unity-path')
        const darkModeQuery = $('#dark-mode')
        this.addUpdatePreferencesEvent<string>(unityPathQuery, 'unityPath')
        this.addUpdatePreferencesEvent<string>($('#package-registry-name'), 'packageRegistryName')
        this.addUpdatePreferencesEvent<string>($('#package-registry-url'), 'packageRegistryUrl')
        this.addUpdatePreferencesEvent<string>($('#package-registry-scope'), 'packageRegistryScope')
        this.addUpdatePreferencesEvent<string>(darkModeQuery, 'darkMode', () => ipc.send('dark-mode:set', darkModeQuery.val()))

        $('#btn-select-unity-path').on('click', async () => ipc.send('select-unity-path'))

        ipc.on(`preference-changed-from-backend-unityPath`, (_, data) => unityPathQuery.val(data))
    }

    private loadInitialValues() {
        this.loadPreference($('#unity-path'), 'unityPath')
        this.loadPreference($('#package-registry-name'), 'packageRegistryName')
        this.loadPreference($('#package-registry-url'), 'packageRegistryUrl')
        this.loadPreference($('#package-registry-scope'), 'packageRegistryScope')
        this.loadPreference($('#theme-source'), 'darkMode')
            .then(value => {
                $('#dark-mode').prop('value', value)
                ipc.send('dark-mode:set', value)
            })
    }

    private async loadPreference(queryElement: JQuery<HTMLElement>, name: string): Promise<string> {
        const data = await ipc.invoke('preferences:request', name)
        queryElement.val(data)
        return data
    }

    private addUpdatePreferencesEvent<Type>(queryElement: JQuery<HTMLElement>, name: string = 'packageRegistryName', f: Function = () =>{}) {
        queryElement.on('change', async () => {
            ipc.send('preferences-changed', {
                name: name,
                value: queryElement.val()
            })
            f()
        })
    }
}

new Preferences()

