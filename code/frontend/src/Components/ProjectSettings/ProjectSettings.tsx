import {FC, useEffect, useState} from 'react'
import {PreferencesContainer, StyledPreferences} from '../StyledComponents/Preferences/StyledPreferences'
import {Preference} from '../Preferences/Preference'

export const ProjectSettings: FC = () => {
    const [settings, setSettings] = useState<Map<string, any>>(new Map())

    const setPref = (key: string, value: any) => {
        setSettings(new Map(settings.set(key, value)))
    }

    const loadSettings = () => {
        return api.invoke(api.channels.toMain.requestProjectSettings)
    }

    const updatePreference = (event, name: string) => {
        const isComplex = settings.get(name)['kind'] !== undefined
        let newValue = isComplex ? {...settings.get(name), value: event.target.value} : event.target.value
        setPref(name, newValue)
        api.send(api.channels.toMain.changeProjectSetting, {name: name, value: newValue})
    }

    const updateListPreference = (parentName: string, index: number, prefName: string, event) => {
        if(settings.size === 0) return
        let newPrefs = new Map(settings)
        let list = newPrefs.get(parentName)['value']
        if(list === undefined) return
        list[index][prefName]['value'] = event.target.value
        newPrefs.set(parentName, {...newPrefs.get(parentName), value: list})
        setSettings(newPrefs)
        api.send(api.channels.toMain.changeProjectSetting, {name: parentName, value: newPrefs.get(parentName)})
    }

    const selectPath = async (prefName) => {
        const path = await api.invoke(api.channels.toMain.showOpenFileDialog) as string
        if(path === undefined) return
        const newValue = {...settings.get(prefName), value: path}
        setPref(prefName, newValue)
        api.send(api.channels.toMain.changeProjectSetting, {name: prefName, value: newValue})
    }

    const createPreferenceComponent = (prefKey: string) => {
        const pref = settings.get(prefKey)
        return createPreferenceComponent2(prefKey, pref)
    }

    const createPreferenceComponent2 = (prefKey: string, pref: any, parentKey = '', index = -1) => {
        const emptyList: string[] = []
        const kind = pref['kind'] || 'string'
        const label = pref['label'] || prefKey
        const options = pref['options'] || emptyList
        const value = pref['value'] || pref
        const onChange = (e) => {
            if(index !== -1) {
                updateListPreference(parentKey, index, prefKey, e)
            } else{
                updatePreference(e, prefKey)
            }
        }
        return (
            <Preference id={prefKey} key={prefKey} label={label} value={value} onChange={onChange}
                        kind={kind} options={options} selectPath={() => selectPath(prefKey)}
                        createPrefComponent={createPreferenceComponent2} />
        )
    }

    useEffect(() => {
        const loadInitialValues = async() => {
            const allPreferences = await loadSettings() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev-'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
        }

        loadInitialValues()
    })


    return (
        <>
            <StyledPreferences>
                <h1>Project Settings</h1>
                <br />

                <PreferencesContainer>
                    {
                        Array.from(settings.keys())
                             .map(prefKey => createPreferenceComponent(prefKey))
                    }
                </PreferencesContainer>
            </StyledPreferences>
        </>
    )
}
