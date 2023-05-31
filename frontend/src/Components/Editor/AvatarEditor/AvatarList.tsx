import { Button, Table, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, sceneObjects, assignSceneObject }) => {
    // TODO: auto update status
    // TODO: only enable download button if ready
    // TODO: download avatars
    // TODO: export to Unity

    return <Table>
        <Table.Head>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
            <Table.TextHeaderCell>Scene Object</Table.TextHeaderCell>
            <Table.TextHeaderCell>Show QR Code</Table.TextHeaderCell>
            <Table.TextHeaderCell>Download</Table.TextHeaderCell>
            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body height={240} minWidth={'600px'}>
            {avatars.map((avatar: AvatarInfo) => (
                <Table.Row key={avatar.id}>
                    <Table.TextCell>{avatar.name}</Table.TextCell>
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