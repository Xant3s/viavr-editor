import { Button, Table, TextInput, toaster, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'
import DeleteAlertDialog, { DeleteDialogResponse } from './DeleteAlertDialog'
import { useEffect } from 'react'


interface props {
    avatars: AvatarInfo[]
    updateQrCode: (avatarId: string, avatarName: string) => void
    deleteAvatar: (avatarId: string) => void
    deleteAvatarFromServer: (avatarId: string) => Promise<number>
    sceneObjects: any[]
    updateAvatar: (avatarId: string, update: (avatar: AvatarInfo) => AvatarInfo) => void
}

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, deleteAvatarFromServer, sceneObjects, updateAvatar }: props) => {
    const [showDeletePrompt, setShowDeletePrompt] = React.useState(false)
    const [status, setStatus] = React.useState<string>('unknown')
    // TODO: auto update status
    // TODO: only enable download button if ready

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

    useEffect(() => {
        const updateStatus = async () => {
            if(avatars.length === 0) {
                setTimeout(updateStatus, 100)
                return
            }
            const urlPref = await api.invoke(api.channels.toMain.requestPreference, 'avatarServer')
            const avatarServerUrl = urlPref.value
            let status
            try {
                const response = await fetch(`${avatarServerUrl}/scans`, {
                    method: 'GET',
                    headers: {
                        'x-scan-id': avatars[0].token
                    }
                })
                if(!response.ok) {
                    console.log(response.statusText)
                    setStatus('something went wrong')
                    setTimeout(updateStatus, 100)
                    return
                }
                status = await response.json()
            } catch(e) {
                console.log(e)
                setStatus('something went wrong')
                setTimeout(updateStatus, 100)
                return
            }
            setStatus(status.status)
            // console.log(status.status, status?.position || '')
            setTimeout(updateStatus, 100)
        }
        updateStatus()
    }, [avatars])

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
            {avatars.map(avatar => (
                <Table.Row key={avatar.id}>
                    <Table.TextCell>
                        <TextInput name='avatar-name-input'
                                   placeholder='Avatar name...'
                                   value={avatar.name}
                                   style={{backgroundColor: avatar.name !== '' ? 'initial' : 'red'}}
                                   onChange={(e) => changeAvatarName(avatar.id, e.target.value)} required />
                    </Table.TextCell>
                    <Table.TextCell>{status}</Table.TextCell>
                    <Table.TextCell>
                        <Select id="sceneObject" value={avatar.sceneObject} style={{minWidth: '100px', height: '30px', backgroundColor: avatar.sceneObject !== '' ? 'initial' : 'red'}}
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
                                    updateQrCode(avatar.id, avatar.name)
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