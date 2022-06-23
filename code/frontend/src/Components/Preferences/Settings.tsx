import {useEffect, useState} from 'react'
// import {Preference} from './Preference'
import { StyledPreferences, PreferencesContainer } from '../StyledComponents/Preferences/StyledPreferences'
import { Setting } from './Preference'
import {Setting_t, value_t} from '../../@types/Settings'

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

    const updateSetting = (name: string, newValue: value_t) => {
        api.send(changeSettingChannel, {name: name, value: newValue})
    }

    // const updatePreference = (name: string, newValue) => {
    //     const isComplex = prefs.get(name)['kind'] !== undefined
    //     let newVal = isComplex ? {...prefs.get(name), value: newValue} : newValue
    //     setPref(name, newVal)
    //     api.send(changeSettingChannel, {name: name, value: newVal})
    // }
    //
    // const updateCompositePreference = (parentName: string, prefName: string, newValue) => {
    //     if(prefs.size === 0) return
    //     let newPrefs = new Map(prefs)
    //     let composite = newPrefs.get(parentName)['value']
    //     if(composite === undefined) return
    //     composite[prefName]['value'] = newValue
    //     newPrefs.set(parentName, {...newPrefs.get(parentName), value: composite})
    //     setPrefs(newPrefs)
    //     api.send(changeSettingChannel, {name: parentName, value: newPrefs.get(parentName)})
    // }
    //
    // const updateListPreference = (prefName: string, index: number, newValue) => {
    //     if(prefs.size === 0) return
    //     let newPrefs = new Map(prefs)
    //     let list = newPrefs.get(prefName)['value']
    //     if(list === undefined) return
    //     list[index]['value'] = newValue
    //     newPrefs.set(prefName, {...newPrefs.get(prefName), value: list})
    //     setPrefs(newPrefs)
    //     api.send(changeSettingChannel, {name: prefName, value: newPrefs.get(prefName)})
    // }
    //
    // const updateCompositeListPreference = (parentName: string, index: number, prefName: string, newValue) => {
    //     if(prefs.size === 0) return
    //     let newPrefs = new Map(prefs)
    //     let list = newPrefs.get(parentName)['value']
    //     if(list === undefined) return
    //     list[index][prefName]['value'] = newValue
    //     newPrefs.set(parentName, {...newPrefs.get(parentName), value: list})
    //     setPrefs(newPrefs)
    //     api.send(changeSettingChannel, {name: parentName, value: newPrefs.get(parentName)})
    // }
    //
    // const createPreferenceComponent = (prefKey: string) => {
    //     const pref = prefs.get(prefKey)
    //     return createPreferenceComponent2(prefKey, pref)
    // }
    //
    // const createPreferenceComponent2 = (prefKey: string, pref: any, parentKey = '', index = -1) => {
    //     const emptyList: string[] = []
    //     const kind = pref['kind'] || 'string'
    //     const label = pref['label'] || prefKey
    //     const value = pref['value'] || pref
    //     const options = pref['options'] || emptyList
    //     const min = pref['min'] || undefined
    //     const max = pref['max'] || undefined
    //     const onChange = (newValue) => {
    //         if(index !== -1 && parentKey !== undefined) {
    //             updateCompositeListPreference(parentKey, index, prefKey, newValue)
    //         } else if(index !== -1) {
    //             updateListPreference(prefKey, index, newValue)
    //         } else if(parentKey !== undefined) {
    //             updateCompositePreference(parentKey, prefKey, newValue)
    //         } else {
    //             updatePreference(prefKey, newValue)
    //         }
    //     }
    //     return (
    //         <Preference id={prefKey} key={prefKey} label={label} value={value} onChange={onChange}
    //                     kind={kind} options={options} min={min} max={max}
    //                     createPrefComponent={createPreferenceComponent2} />
    //     )
    // }

    useEffect(() => {
        const loadInitialValues = async() => {
            const allPreferences = await loadPreferences() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev.'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
        }

        registerUpdateCallbacksFromBackend?.(setPref)
        loadInitialValues()
        // console.log(prefs)
        // log all prefs keys
        // for(const p in Array.from(prefs.keys())) {
        //     console.log(prefs[p])
        // }
        // log all entries in prefs
        // for(const [k, v] in prefs.entries()) {
        //     console.log(p)
        // }
        // for(const [k, v] of Array.from(prefs.entries())) {
        //     console.log(v)
        // }
    })

    const test = (prefKey) => {
        // @ts-ignore
        return (<Setting key={prefKey} settingKey={prefKey as string} setting={prefs[prefKey] as Setting_t} />)
    }

    return (
        <StyledPreferences>
            <h1>{title}</h1>
            <br />

            <PreferencesContainer>
                {
                    // TODO: map initialValues.values to Setting
                    // Array.from(prefs.keys())
                    //      .map(prefKey => createPreferenceComponent(prefKey))

                    // map key, value to Setting(key, value)
                    // Array.from(prefs.keys())
                        // @ts-ignore
                        // .map(prefKey =>(<Setting key={prefKey} settingKey={prefKey as string} setting={prefs[prefKey] as Setting_t} />))
                    Array.from(prefs.entries())
                        // @ts-ignore
                         .map(([prefKey, pref]) => (<Setting key={prefKey} settingKey={prefKey} setting={pref} updateCallback={updateSetting} />))
                }
            </PreferencesContainer>
        </StyledPreferences>
    )
}
