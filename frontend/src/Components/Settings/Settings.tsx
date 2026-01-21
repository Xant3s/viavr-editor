import React, { useEffect, useState } from 'react'
import { toaster } from 'evergreen-ui'
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
    onSettingChange?: (uuid: string, newValue: value_t) => void,
    children?: React.ReactNode,
}

export const Settings = ({
    title,
    loadSettingsChannel,
    changeSettingChannel,
    registerUpdateCallbacksFromBackend,
    onSettingChange,
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

    const sendSettingUpdateToBackend = async (uuid: string, newValue: value_t) => {
        await api.invoke(changeSettingChannel, uuid, newValue)
        toaster.success(translate('prefs_saved'))
        onSettingChange?.(uuid, newValue)
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
        </StyledSettings>
    )
}
