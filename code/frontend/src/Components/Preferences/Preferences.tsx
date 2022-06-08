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
        const isComplex = prefs.get(name)['kind'] !== undefined
        let newValue = isComplex ? {...prefs.get(name), value: event.target.value} : event.target.value
        setPref(name, newValue)
        api.send(api.channels.toMain.changePreference, {name: name, value: newValue})
    }

    const selectPath = async (prefName) => {
        const path = await api.invoke(api.channels.toMain.showOpenFileDialog) as string
        if(path === undefined) return
        const newValue = {...prefs.get(prefName), value: path}
        setPref(prefName, newValue)
        api.send(api.channels.toMain.changePreference, {name: prefName, value: newValue})
    }

    const createPreferenceComponent = (prefKey: string) => {
        if(prefs.size === 0) return
        const pref = prefs.get(prefKey)
        return createPreferenceComponent2(prefKey, pref)
    }

    const createPreferenceComponent2 = (prefKey: string, pref: any) => {
        const emptyList: string[] = []
        const kind = pref['kind'] || 'string'
        const label = pref['label'] || prefKey
        const options = pref['options'] || emptyList
        const value = pref['value'] || pref
        return (
            <Preference id={prefKey} key={prefKey} label={label} value={value} onChange={(e) => updatePreference(e, prefKey)}
                        kind={kind} options={options} selectPath={() => selectPath(prefKey)}
                        createPrefComponent={createPreferenceComponent2} />
        )
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

            {
                Array.from(prefs.keys())
                     .map(prefKey => createPreferenceComponent(prefKey))
            }
        </>
    )
}
