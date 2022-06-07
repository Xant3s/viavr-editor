import {FC, useEffect, useState} from 'react'
import './Preferences.css'
import {Preference} from './Preference'

export const Preferences: FC = () => {
    const [prefs, setPrefs] = useState<Map<string, any>>(new Map())

    const setPref = (key: string, value: any) => {
        setPrefs(new Map(prefs.set(key, value)))
    }

    const loadPreferences = () => {
        return api.invoke(api.channels.toMain.requestPreferences)
    }

    const updatePreference = (event, name: string) => {
        setPref(name, event.target.value)
        api.send(api.channels.toMain.changePreference, {name: name, value: event.target.value})
    }

    useEffect(() => {
        const loadInitialValues = async() => {
            const allPreferences = await loadPreferences() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev-'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
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

            <Preference id={'package-registry-name'} label={'Package registry name'} value={prefs.get('packageRegistryName')} onChange={(e) => {
                updatePreference(e, "packageRegistryName")
            }} />

            <Preference id={'package-registry-url'} label={'Package registry url'} value={prefs.get('packageRegistryUrl')} onChange={(e) => {
                updatePreference(e, "packageRegistryUrl")
            }} />

            <Preference id={'package-registry-scope'} label={'Package registry scope'} value={prefs.get('packageRegistryScope')} onChange={(e) => {
                updatePreference(e, "packageRegistryScope")
            }} />
        </>
    )
}
