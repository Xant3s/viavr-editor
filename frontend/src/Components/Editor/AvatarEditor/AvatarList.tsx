import { Button, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, sceneObjects, updateAvatar }) => {
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
                                onClick={() => {
                                    throw new Error('Not implemented')
                                }}
                        >
                            Download
                        </Button>
                    </Table.TextCell>
                    <Table.TextCell>
                        <Button iconBefore={TrashIcon}
                                appearance='minimal'
                                intent='danger'
                                onClick={() => {
                                    // TODO: ask for confirmation
                                    deleteAvatar(avatar.id)
                                }}
                        >
                            Delete
                        </Button>
                    </Table.TextCell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
}