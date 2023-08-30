import { useEffect, useState } from 'react'
import { toString as QrToString } from 'qrcode'
import { v4 as uuid4 } from 'uuid'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import * as React from 'react'
import { AvatarEditorContainer } from './Styles'
import { QRCodePreview } from './QRCodePreview'
import { AddAvatarForm } from './AddAvatarForm'
import { AvatarList } from './AvatarList'
import { toaster } from 'evergreen-ui'
import { AvatarServerWarning } from './AvatarServerWarning'


export const AvatarEditor = ({ hidden }) => {
    const [avatars, setAvatars] = useState<AvatarInfo[]>([])
    const [qrCode, setQrCode] = useState<string>('')
    const [downloadedAvatars, setDownloadedAvatars] = useState<string[]>([])    // uuids
    const [sceneObjects, setSceneObjects] = React.useState<any[]>([])
    const [avatarServerUrl, setAvatarServerUrl] = React.useState<string>('')
    

    const updateQrCode = (avatarId) => {
        const token = avatars.find(avatar => avatar.id === avatarId)?.token || ''
        QrToString(token, { type: 'svg' }, (err, svg) => {
            setQrCode(svg)
        })
    }

    const addAvatar = async (name: string) => {
        const uuid = uuid4()
        let token = ''
        try {
            const response = await fetch(`${avatarServerUrl}/scanid`)
            const json = await response.json()
            token = json['scan_id']
            if(!response.ok) {
                notifyUserAboutError(response.statusText)
                return
            }
        } catch(e) {
            notifyUserAboutError(e as string)
            return
        }
        const newAvatar = { name: name, id: uuid, token: token, articyId: '', sceneObject: '' }
        const newAvatars = [...avatars, newAvatar]
        setAvatars(newAvatars)
        saveAll(newAvatars)
    }

    const deleteAvatar = async  (avatarId: string) => {
        const newAvatars = avatars.filter(avatar => avatar.id !== avatarId)
        setAvatars(newAvatars)
        await api.invoke(api.channels.toMain.deleteAvatarFromFileSystem, avatarId)
        saveAll(newAvatars)
    }
    
    const deleteAvatarFromServer = async (avatarId: string) => {
        try {
            const response = await fetch(`${avatarServerUrl}/scans/delete`, {
                method: 'POST',
                headers: {
                    'x-scan-id': avatarId
                }
            })
            if(!response.ok) {
                notifyUserAboutError(response.statusText)
                return 1
            }
        } catch(e) {
            notifyUserAboutError(e as string)
            return 1
        }
        toaster.success('Avatar deleted from server')
        return 0
    }
    
    const updateAvatar = (avatarId: string, modifier: (a: AvatarInfo) => AvatarInfo) => {
        const newAvatars = avatars.map(avatar => {
            if(avatar.id === avatarId) {
                avatar = modifier(avatar)
            }
            return avatar
        })
        setAvatars(newAvatars)
        saveAll(newAvatars)
    }

    const saveAll = (newAvatars = avatars) => {
        api.invoke(api.channels.toMain.setBuildSetting, 'avatars', newAvatars)
    }

    const loadSceneObjects = async () => {
        const objects = await api.invoke(api.channels.toMain.getSceneObjects)
        setSceneObjects(objects)
    }

    useEffect(() => {
        const loadAvatars = async () => {
            const avatars = await api.invoke(api.channels.toMain.getBuildSetting, 'avatars')
            if(avatars === undefined) return
            setAvatars(avatars)
            // TODO: check if avatars are downloaded
        }
        
        const loadAvatarServerUrl = async () => {
            const urlPref = await api.invoke(api.channels.toMain.requestPreference, 'avatarServer')
            setAvatarServerUrl(urlPref.value)
        }

        if(!hidden) {
            loadSceneObjects()
            loadAvatars()
            loadAvatarServerUrl()
        }
    }, [hidden])


    return <AvatarEditorContainer hidden={hidden}>
        <AvatarServerWarning avatarServerUrl={avatarServerUrl} />
        <h1>Avatar Editor</h1>
        {qrCode !== '' && <QRCodePreview qrCode={qrCode} />}
        <AvatarList avatars={avatars} updateQrCode={updateQrCode} deleteAvatar={deleteAvatar} 
                    deleteAvatarFromServer={deleteAvatarFromServer}
                    sceneObjects={sceneObjects} updateAvatar={updateAvatar}/>
        <AddAvatarForm addAvatar={addAvatar} />
    </AvatarEditorContainer>
}


function notifyUserAboutError(msg: string) {
    toaster.danger('Failed to contact the avatar server', {
        description: msg,
    })
    console.log('error', msg)
}