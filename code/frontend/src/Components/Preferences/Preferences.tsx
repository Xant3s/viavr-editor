import {FC, useEffect, useState} from 'react'
import './Preferences.css'
import {Preference} from './Preference'

export const Preferences: FC = () => {
    const [prefs, setPrefs] = useState<Map<string, any>>(new Map())

    const setPref = (key: string, value: any) => {
        setPrefs(new Map(prefs.set(key, value)))
    }

    const loadPreference = (name: string) => {
        return api.invoke(api.channels.toMain.requestPreference, name)
    }

    const updatePreference = (event, name: string) => {
        setPref(name, event.target.value)
        api.send(api.channels.toMain.changePreference, {name: name, value: event.target.value})
    }

    useEffect(() => {
        const loadInitialValues = async() => {
            const [unityPath, registryName, registryUrl, registryScope, themeSource] = await Promise.all([
                loadPreference('unityPath'),
                loadPreference('packageRegistryName'),
                loadPreference('packageRegistryUrl'),
                loadPreference('packageRegistryScope'),
                loadPreference('darkMode')
            ])
            setPref('unityPath', unityPath)
            setPref('registryName', registryName)
            setPref('registryUrl', registryUrl)
            setPref('registryScope', registryScope)
            setPref('darkMode', themeSource)
        }

        api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {setPref('unityPath', data)})

        loadInitialValues()
    })


    return (
        <>
            <h1>Preferences</h1>
            <br />

            <Preference id={'dark-mode'} label={'Theme'} value={prefs.get('darkMode')} onChange={(e) => {
                updatePreference(e, "darkMode")
                api.send(api.channels.toMain.setDarkMode, e.target.value)
            }} kind={'dropdown'} options={['System', 'Dark', 'Light']} />

            <Preference id={'unity-path'} label='Path to Unity executable' value={prefs.get('unityPath')} onChange={(e) => {
                updatePreference(e, "unityPath")
            }} kind={'path'} selectPath={() => {api.send(api.channels.toMain.selectUnityPath)}}  />

            <Preference id={'package-registry-name'} label={'Package registry name'} value={prefs.get('registryName')} onChange={(e) => {
                updatePreference(e, "packageRegistryName")
            }} />

            <Preference id={'package-registry-url'} label={'Package registry url'} value={prefs.get('registryUrl')} onChange={(e) => {
                updatePreference(e, "packageRegistryUrl")
            }} />

            <Preference id={'package-registry-scope'} label={'Package registry scope'} value={prefs.get('registryScope')} onChange={(e) => {
                updatePreference(e, "packageRegistryScope")
            }} />
        </>
    )
}
