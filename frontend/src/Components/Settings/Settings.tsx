import React, { useEffect, useState } from 'react'
import { SettingsContainer, StyledSettings } from '../StyledComponents/Preferences/StyledSettings'
import { Setting } from './Setting'
import { value_t } from '../../@types/Settings'
import { Button } from '../StyledComponents/Button'
import { useTranslation } from '../../LocalizationContext'

export declare interface SettingsProps {
    title: string,
    loadSettingsChannel: string,
    changeSettingChannel: string,
    registerUpdateCallbacksFromBackend?: (setPref) => void,
    children?: React.ReactNode,
}

export const Settings = ({
    title,
    loadSettingsChannel,
    changeSettingChannel,
    registerUpdateCallbacksFromBackend,
    children
}: SettingsProps) => {
    const { translate } = useTranslation()
    const [prefs, setPrefs] = useState<Map<string, any>>(new Map())

    const setPref = (key: string, value: any) => {
        setPrefs(new Map(prefs.set(key, value)))
    }

    const loadPreferences = () => {
        return api.invoke(loadSettingsChannel)
    }

    const sendSettingUpdateToBackend = (uuid: string, newValue: value_t) => {
        api.invoke(changeSettingChannel, uuid, newValue)
    }

    useEffect(() => {
        const loadInitialValues = async () => {
            const allPreferences = await loadPreferences() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev.'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
        }

        registerUpdateCallbacksFromBackend?.(setPref)
        loadInitialValues()
    })

    const closeWindow = () => {
        window.close();
    };

    return (
        <StyledSettings>
            <h1>{title}</h1>
            <br />

            <SettingsContainer>
                {children}
                {
                    Array.from(prefs.entries())
                        // @ts-ignore
                        .map(([prefKey, pref]) => (<Setting key={prefKey} settingKey={prefKey} setting={pref}
                            updateCallback={sendSettingUpdateToBackend} />))
                }
            </SettingsContainer>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#15171B' }}>
                <Button style={{ fontSize: '18px' }} onClick={closeWindow}>
                    {translate('settings_exit')}
                </Button>
            </div>
        </StyledSettings>
    )
}
