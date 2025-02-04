import { useState } from 'react'
import { Button, TextInput } from 'evergreen-ui'
import * as React from 'react'
import { useTranslation } from '../../../LocalizationContext'

export const AddAvatarForm = ({ addAvatar }) => {
    const { translate, language, setLanguage } = useTranslation()
    const [newAvatarName, setNewAvatarName] = useState<string>('')

    function handleSubmit(event) {
        event.preventDefault()
        addAvatar(newAvatarName)
        setNewAvatarName('')
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
            <form onSubmit={handleSubmit}>
                <TextInput
                    name="new-avatar-name-input"
                    placeholder={translate('add_avatar.placeholder')}
                    value={newAvatarName}
                    onChange={(e) => setNewAvatarName(e.target.value)}
                    required
                />
                <Button appearance="primary" style={{ marginRight: '5px', marginLeft: '5px' }} type="submit">
                    {translate('add_avatar.create_button')}
                </Button>
            </form>
        </div>
    )
}