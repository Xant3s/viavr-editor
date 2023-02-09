import { FC } from 'react'
import { Settings } from '../Settings/Settings'


export const ProjectSettings: FC = () => {
    return (
        <Settings title={'Project Settings'}
                  loadSettingsChannel={api.channels.toMain.requestProjectSettings}
                  changeSettingChannel={api.channels.toMain.changeProjectSetting} />
    )
}
