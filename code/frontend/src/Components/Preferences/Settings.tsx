import {useEffect, useState} from 'react'
import {Preference} from './Preference'
import { StyledPreferences, PreferencesContainer } from '../StyledComponents/Preferences/StyledPreferences'

export declare interface SettingsProps {
    title: string,
    loadSettingsChannel: string,
    changeSettingChannel: string,
    registerUpdateCallbacksFromBackend?: (setPref) => void
}

export const Settings = ({title, loadSettingsChannel, changeSettingChannel, registerUpdateCallbacksFromBackend}: SettingsProps) => {
    const [prefs, setPrefs] = useState<Map<string, any>>(new Map())

    const setPref = (key: string, value: any) => {
        setPrefs(new Map(prefs.set(key, value)))
    }

    const loadPreferences = () => {
        return api.invoke(loadSettingsChannel)
    }

    const updatePreference = (name: string, newValue) => {
        const isComplex = prefs.get(name)['kind'] !== undefined
        let newVal = isComplex ? {...prefs.get(name), value: newValue} : newValue
        setPref(name, newVal)
        api.send(changeSettingChannel, {name: name, value: newVal})
    }

    const updateListPreference = (parentName: string, index: number, prefName: string, newValue) => {
        if(prefs.size === 0) return
        let newPrefs = new Map(prefs)
        let list = newPrefs.get(parentName)['value']
        if(list === undefined) return
        list[index][prefName]['value'] = newValue
        newPrefs.set(parentName, {...newPrefs.get(parentName), value: list})
        setPrefs(newPrefs)
        api.send(changeSettingChannel, {name: parentName, value: newPrefs.get(parentName)})
    }

    const selectPath = async (prefName) => {
        const path = await api.invoke(api.channels.toMain.showOpenFileDialog) as string
        if(path === undefined) return
        const newValue = {...prefs.get(prefName), value: path}
        setPref(prefName, newValue)
        api.send(changeSettingChannel, {name: prefName, value: newValue})
    }

    const createPreferenceComponent = (prefKey: string) => {
        const pref = prefs.get(prefKey)
        return createPreferenceComponent2(prefKey, pref)
    }

    const createPreferenceComponent2 = (prefKey: string, pref: any, parentKey = '', index = -1) => {
        const emptyList: string[] = []
        const kind = pref['kind'] || 'string'
        const label = pref['label'] || prefKey
        const value = pref['value'] || pref
        const options = pref['options'] || emptyList
        const min = pref['min'] || undefined
        const max = pref['max'] || undefined
        const onChange = (newValue) => {
            if(index !== -1) {
                updateListPreference(parentKey, index, prefKey, newValue)
            } else{
                updatePreference(prefKey, newValue)
            }
        }
        return (
            <Preference id={prefKey} key={prefKey} label={label} value={value} onChange={onChange}
                        kind={kind} options={options} min={min} max={max} selectPath={() => selectPath(prefKey)}
                        createPrefComponent={createPreferenceComponent2} />
        )
    }

    useEffect(() => {
        const loadInitialValues = async() => {
            const allPreferences = await loadPreferences() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev.'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
        }

        registerUpdateCallbacksFromBackend?.(setPref)
        loadInitialValues()
    })


    return (
        <StyledPreferences>
            <h1>{title}</h1>
            <br />

            <PreferencesContainer>
                {
                    Array.from(prefs.keys())
                         .map(prefKey => createPreferenceComponent(prefKey))
                }
            </PreferencesContainer>
        </StyledPreferences>
    )
}
