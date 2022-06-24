import {useEffect, useState} from 'react'
import {StyledSettings, SettingsContainer} from '../StyledComponents/Preferences/StyledSettings'
import {Setting} from './Setting'
import {value_t} from '../../@types/Settings'

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

    const sendSettingUpdateToBackend = (uuid: string, newValue: value_t) => {
        api.send(changeSettingChannel, uuid, newValue)
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
        <StyledSettings>
            <h1>{title}</h1>
            <br />

            <SettingsContainer>
                {
                    Array.from(prefs.entries())
                        // @ts-ignore
                         .map(([prefKey, pref]) => (<Setting key={prefKey} settingKey={prefKey} setting={pref} updateCallback={sendSettingUpdateToBackend} />))
                }
            </SettingsContainer>
        </StyledSettings>
    )
}
