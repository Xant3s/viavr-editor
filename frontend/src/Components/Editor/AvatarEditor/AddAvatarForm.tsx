import { useState } from 'react'
import { Button, TextInput } from 'evergreen-ui'
import * as React from 'react'

export const AddAvatarForm = ({addAvatar}) => {
    const [newAvatarName, setNewAvatarName] = useState<string>('')

    function handleSubmit() {
        addAvatar(newAvatarName)
        setNewAvatarName('')
    }


    return <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
        <form onSubmit={handleSubmit}>
            <TextInput name='new-avatar-name-input'
                       placeholder='New avatar name...'
                       value={newAvatarName}
                       onChange={(e) => setNewAvatarName(e.target.value)} required />
            <Button appearance='primary' style={{ marginRight: '5px' }} type="submit">
                Create new avatar
            </Button>
        </form>

        {/*TODO: load avatar from file*/}
        <Button appearance='primary'
                onClick={() => {
                    throw new Error('Not implemented')
                }}
        >
            Load avatar from file
        </Button>
    </div>
}