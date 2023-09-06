import { Button, Table, TextInput, toaster, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { useEffect } from 'react'
import DeleteAlertDialog, { DeleteDialogResponse } from './DeleteAlertDialog'
import { CenteredSpinner } from '../../Utils/CenteredSpinner'

type Status = 'waitingforupload'| 'uploading'| 'queued'| 'processing'| 'done'| 'downloaded' | 'failed to talk to the server'

interface props {
    avatars: AvatarInfo[]
    updateQrCode: (avatarId: string, avatarName: string) => void
    deleteAvatar: (avatarId: string) => void
    deleteAvatarFromServer: (avatarId: string) => Promise<number>
    sceneObjects: any[]
    updateAvatar: (avatarId: string, update: (avatar: AvatarInfo) => AvatarInfo) => void
}

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, deleteAvatarFromServer, sceneObjects, updateAvatar }: props) => {
    const [avatarServerUrl, setAvatarServerUrl] = React.useState<string>('')
    const [showDeletePrompt, setShowDeletePrompt] = React.useState(false)
    const [avatarStatusList, setAvatarStatusList] = React.useState<Map<string, Status>>(new Map<string, Status>())  // token -> status
    const statusUpdateInterval = 1000

    
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
    
    const getAction = (avatar: AvatarInfo) => {
        const status = avatarStatusList.get(avatar.token) || 'waitingforupload'
        switch(status) {
            case 'waitingforupload':
                return <ShowQrCodeButton avatar={avatar} updateQrCode={updateQrCode} />
            case 'done':
                return <DownloadButton avatar={avatar} setDownloaded={() => {
                    const newAvatarStatusList = new Map<string, Status>(avatarStatusList)
                    newAvatarStatusList.set(avatar.token, 'downloaded')
                    setAvatarStatusList(newAvatarStatusList)
                }} />
            default:
                return <></>
        }
    }

    useEffect(() => {
        const getAvatarServerUrl = async () => {
            const urlPref = await api.invoke(api.channels.toMain.requestPreference, 'avatarServer')
            setAvatarServerUrl(urlPref.value)
        }
        getAvatarServerUrl()
    }, [])

    useEffect(() => {
        const updateStatus = async () => {
            if(avatars.length === 0 || avatarServerUrl === '') return
            const newStatusList = avatars.map(async avatar => {
                const oldStatus = avatarStatusList.get(avatar.token) || 'waitingforupload'
                const newStatus = await tryFetchStatus(avatar.token, oldStatus)
                return [avatar.token, newStatus] as [string, Status]
            })
            setAvatarStatusList(new Map<string, Status>(await Promise.all(newStatusList)))
        }

        async function tryFetchStatus(avatarToken: string, currentStatus: Status) : Promise<Status> {
            if(currentStatus === 'downloaded') return currentStatus
            try {
                const response = await fetch(`${avatarServerUrl}/scans`, {
                    method: 'GET',
                    headers: {
                        'x-scan-id': avatarToken,
                    },
                })
                if(response.status === 400) return 'waitingforupload'
                if(!response.ok) return 'failed to talk to the server'
                const status = await response.json()
                return status.status
            } catch(e) {
                console.log(e)
                return 'failed to talk to the server'
            }
        }
        
        const updateStatusInterval = setInterval(updateStatus, statusUpdateInterval)
        return () => clearInterval(updateStatusInterval)
    }, [avatars, avatarStatusList, avatarServerUrl])

    function statusToText(status: Status): string {
        if(status === 'done') return 'ready to download'
        return status
    }

    return <Table>
        <Table.Head>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Placeholder Object</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
            <Table.TextHeaderCell>Action</Table.TextHeaderCell>
            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body height={240} minWidth={'600px'}>
            {avatars.map(avatar => (
                <Table.Row key={avatar.id}>
                    <Table.TextCell>
                        <TextInput name='avatar-name-input'
                                   placeholder='Avatar name...'
                                   value={avatar.name}
                                   style={{ backgroundColor: avatar.name !== '' ? 'initial' : 'red' }}
                                   onChange={(e) => changeAvatarName(avatar.id, e.target.value)} required />
                    </Table.TextCell>
                    <Table.TextCell>
                        <Select id="sceneObject" value={avatar.sceneObject} style={{
                            minWidth: '100px',
                            height: '30px',
                            backgroundColor: avatar.sceneObject !== '' ? 'initial' : 'red'
                        }}
                                onChange={e => assignSceneObject(avatar.id, e.target.value)} required>
                            {sceneObjects.map((object, index) => (
                                <MenuItem key={index} value={object.uuid}>
                                    {object.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Table.TextCell>
                    <Table.TextCell>{statusToText(avatarStatusList.get(avatar.token) || 'waitingforupload')}</Table.TextCell>
                    <Table.TextCell>
                        {getAction(avatar)}
                    </Table.TextCell>
                    <Table.TextCell>
                        <DeleteAlertDialog open={showDeletePrompt} setOpen={setShowDeletePrompt}
                                           handleDialog={(res) => handleDeleteDialog(avatar.id, res)} />
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

const ShowQrCodeButton = ({avatar, updateQrCode}: {avatar: AvatarInfo, updateQrCode: (avatarId: string, avatarName: string) => void}) => {
    return <Button appearance='primary'
            style={{ width: '100%' }}
            onClick={() => {
                updateQrCode(avatar.id, avatar.name)
            }}
    >
        Show QR Code
    </Button>
}

const DownloadButton = ({avatar, setDownloaded}: { avatar: AvatarInfo, setDownloaded: () => void }) => {
    const [downloading, setDownloading] = React.useState(false)

    return <>
        {downloading ? <CenteredSpinner size={24} showLabel={false} />
            : <Button appearance='primary'
                      style={{ width: '100%' }}
                      onClick={async () => {
                          setDownloading(true)
                          const result = await api.invoke(api.channels.toMain.downloadAvatar, avatar.id)
                          if(result === 0) {
                              toaster.success('Avatar downloaded successfully')
                              setDownloaded()
                          } else {
                              toaster.danger('Avatar download failed')
                          }
                          setDownloading(false)
                      }}
            >
                Download
            </Button>
        }
    </> 
}