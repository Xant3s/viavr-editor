import { Button, Table, TextInput, toaster, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'
import DeleteAlertDialog, { DeleteDialogResponse } from './DeleteAlertDialog'

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, deleteAvatarFromServer, sceneObjects, updateAvatar }) => {
    const [showDeletePrompt, setShowDeletePrompt] = React.useState(false)
    // TODO: auto update status
    // TODO: only enable download button if ready
    // TODO: download avatars
    // TODO: export to Unity

    const changeAvatarName = (avatarId: string, newName: string) => {
        return updateAvatar(avatarId, (avatar: AvatarInfo) => {
            avatar.name = newName
            return avatar
        })
    }

    const assignSceneObject = (avatarId: string, sceneObjectId: string) => {
        updateAvatar(avatarId, (avatar: AvatarInfo) => {
            avatar.sceneObject = sceneObjectId
            return avatar
        })
    }
    
    const handleDeleteDialog = async (avatarId: string, dialogResponse: DeleteDialogResponse) => {
        if(dialogResponse === 'abort') return
        let errorCode = 0
        if(dialogResponse === 'deleteFromServer') {
            errorCode = await deleteAvatarFromServer(avatarId)
        }
        if(errorCode === 0) {
            deleteAvatar(avatarId)
        }
    }

    return <Table>
        <Table.Head>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
            <Table.TextHeaderCell>Placeholder Object</Table.TextHeaderCell>
            <Table.TextHeaderCell>Show QR Code</Table.TextHeaderCell>
            <Table.TextHeaderCell>Download</Table.TextHeaderCell>
            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body height={240} minWidth={'600px'}>
            {avatars.map((avatar: AvatarInfo) => (
                <Table.Row key={avatar.id}>
                    <Table.TextCell>
                        <TextInput name='avatar-name-input'
                                   placeholder='Avatar name...'
                                   value={avatar.name}
                                   onChange={(e) => changeAvatarName(avatar.id, e.target.value)} required />
                    </Table.TextCell>
                    <Table.TextCell>Please start download</Table.TextCell>
                    <Table.TextCell>
                        <Select id="sceneObject" value={avatar.sceneObject} style={{minWidth: '100px', height: '30px'}}
                                onChange={e => assignSceneObject(avatar.id, e.target.value)} required>
                            {sceneObjects.map((object, index) => (
                                <MenuItem key={index} value={object.uuid}>
                                    {object.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Table.TextCell>
                    <Table.TextCell>
                        <Button appearance='primary'
                                style={{ width: '100%' }}
                                onClick={() => {
                                    updateQrCode(avatar.id)
                                }}
                        >
                            Show QR Code
                        </Button>
                    </Table.TextCell>
                    <Table.TextCell>
                        <Button appearance='primary'
                                style={{ width: '100%' }}
                                onClick={async () => {
                                    const result = await api.invoke(api.channels.toMain.downloadAvatar, avatar.id)
                                    if(result === 0) {
                                        toaster.success('Avatar downloaded successfully')
                                    } else {
                                        toaster.danger('Avatar download failed')
                                    }
                                }}
                        >
                            Download
                        </Button>
                    </Table.TextCell>
                    <Table.TextCell>
                        <DeleteAlertDialog open={showDeletePrompt} setOpen={setShowDeletePrompt} handleDialog={(res) => handleDeleteDialog(avatar.id, res)} />
                        <Button iconBefore={TrashIcon}
                                appearance='minimal'
                                intent='danger'
                                onClick={async () => setShowDeletePrompt(true)}
                        >
                            Delete
                        </Button>
                    </Table.TextCell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
}