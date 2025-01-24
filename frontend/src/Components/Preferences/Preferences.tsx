import { FC } from 'react'
import { Settings } from '../Settings/Settings'
import { LanguageSelector } from '../../LocalizationContext'
import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { Box } from '@mui/material'

export const Preferences: FC = () => {
    return (<>
        <Settings title={'Preferences'}
                  loadSettingsChannel={api.channels.toMain.requestPreferences}
                  changeSettingChannel={api.channels.toMain.changePreference}
                  registerUpdateCallbacksFromBackend={(setPref) => {
                      api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {
                          setPref('unityPath', data)
                      })
                  }}>
            <Box display="flex" alignItems="center" marginBottom={'15px'}>
                <SettingEntryLabel>Language (en/de/system):</SettingEntryLabel>
                <LanguageSelector/>
            </Box>
        </Settings>
        </>
    )
}
