import { FC } from 'react'
import { Settings } from '../Settings/Settings'
import { useTranslation } from '../../LocalizationContext'

export const ProjectSettings: FC = () => {
    const { translate } = useTranslation()

    return (
        <Settings
            title={translate('project_settings_title')}
            loadSettingsChannel={api.channels.toMain.requestProjectSettings}
            changeSettingChannel={api.channels.toMain.changeProjectSetting}
        />
    )
}
