import { InlineAlert } from 'evergreen-ui'
import * as React from 'react'
import { useTranslation } from '../../../LocalizationContext'

interface props {
    avatarServerUrl: string
}

const bannerStyle = {
    backgroundColor: 'white',
    alignContent: 'center',
    padding: '10px',
    display: 'inline-block',
}

export const AvatarServerWarning = ({ avatarServerUrl }: props) => {
    const { translate, language, setLanguage } = useTranslation()

    return <>
        {avatarServerUrl === '' &&
            <div style={bannerStyle}>
                <InlineAlert intent='danger'>{translate('avatar_server_warning')}</InlineAlert>
            </div>
        }
    </>
}