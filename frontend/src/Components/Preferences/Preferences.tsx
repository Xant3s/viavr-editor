import { FC } from 'react'
import { Settings } from '../Settings/Settings'

export const Preferences: FC = () => {
    return (<>
        <Settings title={'Preferences'}
                  loadSettingsChannel={api.channels.toMain.requestPreferences}
                  changeSettingChannel={api.channels.toMain.changePreference}
                  registerUpdateCallbacksFromBackend={(setPref) => {
                      api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {
                          setPref('unityPath', data)
                      })
                  }}
                  />
        </>
    )
}
