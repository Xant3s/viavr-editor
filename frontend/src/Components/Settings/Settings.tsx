import React, { useEffect, useState, useCallback, useRef } from 'react'
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

    const setPref = useCallback((key: string, value: any) => {
        setPrefs(prevPrefs => new Map(prevPrefs.set(key, value)))
    }, [])

    const loadPreferences = useCallback(() => {
        return api.invoke(loadSettingsChannel)
    }, [loadSettingsChannel])

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const sendSettingUpdateToBackend = useCallback(async (uuid: string, newValue: value_t) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(async () => {
            await api.invoke(changeSettingChannel, uuid, newValue)
            toaster.success(translate('prefs_saved'), { id: 'prefs-saved' })
            onSettingChange?.(uuid, newValue)
            saveTimeoutRef.current = null
        }, 300)
    }, [changeSettingChannel, translate, onSettingChange])

    useEffect(() => {
        const loadInitialValues = async () => {
            const allPreferences = await loadPreferences() as [string, unknown][]
            const preferencesExcludingDevPreferences = allPreferences.filter(pref => !pref[0].startsWith('dev.'))
            preferencesExcludingDevPreferences.forEach(pref => setPref(pref[0] as string, pref[1]))
        }

        registerUpdateCallbacksFromBackend?.(setPref)
        loadInitialValues()
    }, [loadPreferences, registerUpdateCallbacksFromBackend, setPref])

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
