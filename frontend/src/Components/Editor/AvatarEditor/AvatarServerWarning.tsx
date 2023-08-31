import { InlineAlert } from 'evergreen-ui'
import * as React from 'react'


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
    return <>
        {avatarServerUrl === '' && 
            <div style={bannerStyle}>
                <InlineAlert intent='danger'>Please specify an avatar server url in the preferences.</InlineAlert>
            </div>
        }
    </>
}
