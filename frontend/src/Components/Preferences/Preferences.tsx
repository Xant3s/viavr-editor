import { FC } from 'react'
import { Settings } from '../Settings/Settings'
import { LanguageSelector } from '../../LocalizationContext'
import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { Box } from '@mui/material'
import { useTranslation } from '../../LocalizationContext'

export const Preferences: FC = () => {
    const {translate, language, setLanguage} = useTranslation()

    return (<>
        <Settings title={translate('prefs_title')}
                  loadSettingsChannel={api.channels.toMain.requestPreferences}
                  changeSettingChannel={api.channels.toMain.changePreference}
                  registerUpdateCallbacksFromBackend={(setPref) => {
                      api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {
                          setPref('unityPath', data)
                      })
                  }}>
            <Box display="flex" alignItems="center" marginBottom={'15px'}>
                <SettingEntryLabel>{translate('prefs_language')}</SettingEntryLabel>
                <LanguageSelector/>
            </Box>
        </Settings>
        </>
    )
}