import { FC, useCallback, useMemo } from 'react'
import { Settings } from '../Settings/Settings'
import { LanguageSelector } from '../../LocalizationContext'
import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { Box } from '@mui/material'
import { useTranslation } from '../../LocalizationContext'
import { toaster } from 'evergreen-ui'
import { value_t } from '../../@types/Settings'

export const Preferences: FC = () => {
    const { translate, language, setLanguage } = useTranslation()

    const checkPackageRegistryReachability = useCallback(async (uuid: string, newValue: value_t) => {
        // Check if this is a string value (could be a package registry URL)
        if (typeof newValue === 'string' && newValue.trim() !== '') {
            const result = await api.invoke(api.channels.toMain.checkPackageRegistryReachable, newValue) as { reachable: boolean, error?: string }
            if (!result.reachable) {
                if (result.error === 'empty') {
                    toaster.warning(translate('prefs_registry_empty'), { duration: 8, id: 'registry-reachability' })
                } else {
                    toaster.warning(translate('prefs_registry_unreachable').replace('{url}', newValue), { duration: 8, id: 'registry-reachability' })
                }
            }
        }
    }, [translate])

    const registerUpdateCallbacks = useCallback((setPref) => {
        api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {
            setPref('unityPath', data)
        })
    }, [])

    return (<>
        <Settings title={translate('prefs_title')}
            loadSettingsChannel={api.channels.toMain.requestPreferences}
            changeSettingChannel={api.channels.toMain.changePreference}
            onSettingChange={checkPackageRegistryReachability}
            registerUpdateCallbacksFromBackend={registerUpdateCallbacks}>
            <Box display="flex" alignItems="center" marginBottom={'15px'}>
                <SettingEntryLabel>{translate('prefs_language')}</SettingEntryLabel>
                <LanguageSelector />
            </Box>
        </Settings>
    </>
    )
}