import { Button, Table, TextInput, toaster, TrashIcon } from 'evergreen-ui'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { useEffect } from 'react'
import DeleteAlertDialog, { DeleteDialogResponse } from './DeleteAlertDialog'
import { CenteredSpinner } from '../../Utils/CenteredSpinner'

type Status = 'waitingforupload'| 'uploading'| 'queued'| 'processing'| 'done'| 'downloaded' | 'expired' | 'failed to talk to the server'

interface props {
    avatars: AvatarInfo[]
    updateQrCode: (avatarToken: string, avatarName: string) => void
    deleteAvatar: (avatarToken: string) => void
    deleteAvatarFromServer: (avatarToken: string) => Promise<number>
    sceneObjects: any[]
    updateAvatar: (avatarToken: string, update: (avatar: AvatarInfo) => AvatarInfo) => void
}

export const AvatarList = ({ avatars, updateQrCode, deleteAvatar, deleteAvatarFromServer, sceneObjects, updateAvatar }: props) => {
    const [avatarServerUrl, setAvatarServerUrl] = React.useState<string>('')
    const [showDeletePrompt, setShowDeletePrompt] = React.useState(false)
    const [avatarStatusList, setAvatarStatusList] = React.useState<Map<string, Status>>(new Map<string, Status>())  // token -> status
    const statusUpdateInterval = 1000

    const tableRowStyle = {
        backgroundColor: '#3A4048',
        color: '#4D535B',
        borderColor:'#6C737A' 
    };
    const tableHeaderStyle ={
        backgroundColor: '#6C737A',
        color:'white',
        borderColor:'#6C737A',
    };


    const changeAvatarName = (avatarToken: string, newName: string) => {
        return updateAvatar(avatarToken, (avatar: AvatarInfo) => {
            avatar.name = newName
            return avatar
        })
    }

    const assignSceneObject = (avatarToken: string, sceneObjectId: string) => {
        updateAvatar(avatarToken, (avatar: AvatarInfo) => {
            avatar.sceneObject = sceneObjectId
            return avatar
        })
    }
    
    const handleDeleteDialog = async (avatarToken: string, dialogResponse: DeleteDialogResponse) => {
        if(dialogResponse === 'abort') return
        let errorCode = 0
        if(dialogResponse === 'deleteFromServer') {
            errorCode = await deleteAvatarFromServer(avatarToken)
        }
        if(errorCode === 0) {
            deleteAvatar(avatarToken)
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
            const wasDownloaded = currentStatus === 'downloaded'
            try {
                const response = await fetch(`${avatarServerUrl}/scans`, {
                    method: 'GET',
                    headers: {
                        'x-scan-id': avatarToken,
                    },
                })
                if(response.status === 400) return wasDownloaded ? 'expired' : 'waitingforupload'
                if(wasDownloaded) return 'downloaded'
                if(!response.ok) return 'failed to talk to the server'
                const status = await response.json()
                return status.status
            } catch(e) {
                console.log(e)
                return wasDownloaded ? 'downloaded' : 'failed to talk to the server'
            }
        }
        
        const updateStatusInterval = setInterval(updateStatus, statusUpdateInterval)
        return () => clearInterval(updateStatusInterval)
    }, [avatars, avatarStatusList, avatarServerUrl])

    function statusToText(status: Status): string {
        if(status === 'done') return 'ready to download'
        return status
    }

    return <Table style={{borderColor:'#6C737A'}}>
        <Table.Head style={tableHeaderStyle}>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Placeholder Object</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
            <Table.TextHeaderCell>Action</Table.TextHeaderCell>
            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
        </Table.Head>
        {avatars.length===0 && 
                        <div>
                            <p style={{color:'#BCBEC1'}}> 
                                Add an avatar using the Add Character Button.<br></br>
                            </p>
                        </div>
                        }
        <Table.Body minHeight={240} maxHeight={320} minWidth={'600px'}>
            {avatars.map(avatar => (
                <Table.Row key={avatar.token} style={tableRowStyle}>
                    <Table.TextCell>
                        <TextInput name='avatar-name-input'
                                   placeholder='Please enter the characters name'
                                   value={avatar.name}
                                   style={{ backgroundColor:'white',
                                            width:'90%' }}
                                   onChange={(e) => changeAvatarName(avatar.token, e.target.value)} required />
                    </Table.TextCell>
                    <Table.TextCell>
                        <Select id="sceneObject" value={avatar.sceneObject} style={{
                            width:'80%',
                            height: '30px',
                            backgroundColor: avatar.sceneObject !== '' ? 'white' : 'red'
                        }}
                                onChange={e => assignSceneObject(avatar.token, e.target.value)} required>
                            {sceneObjects.map((object, index) => (
                                <MenuItem key={index} value={object.uuid}>
                                    {object.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Table.TextCell>
                    <Table.TextCell>
                        <p style={{color:'white'}}>
                            {statusToText(avatarStatusList.get(avatar.token) || 'waitingforupload')}
                        </p>
                    </Table.TextCell>
                    <Table.TextCell>
                        {getAction(avatar)}
                    </Table.TextCell>
                    <Table.TextCell>
                        <DeleteAlertDialog open={showDeletePrompt} setOpen={setShowDeletePrompt}
                                           handleDialog={(res) => handleDeleteDialog(avatar.token, res)}
                                           avatarIsOnServer={avatarStatusList.get(avatar.token) !== 'waitingforupload' && avatarStatusList.get(avatar.token) !== 'expired'}
                        />
                        <Button iconBefore={TrashIcon}
                                appearance='minimal'
                                intent='danger'
                                onClick={async () => setShowDeletePrompt(true)}
                                style={{color:'white', backgroundColor:'#3A4048'}}
                        >
                            Delete
                        </Button>
                    </Table.TextCell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
}

const ShowQrCodeButton = ({avatar, updateQrCode}: {avatar: AvatarInfo, updateQrCode: (avatarToken: string, avatarName: string) => void}) => {
    return <Button appearance='primary'
            style={{ width: '100%' }}
            onClick={() => {
                updateQrCode(avatar.token, avatar.name)
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
                          const result = await api.invoke(api.channels.toMain.downloadAvatar, avatar.token)
                          if(result === 0) {
                              toaster.success('Character downloaded successfully')
                              setDownloaded()
                          } else {
                              toaster.danger('Character download failed')
                          }
                          setDownloading(false)
                      }}
            >
                Download
            </Button>
        }
    </> 
}