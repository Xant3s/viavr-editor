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
        const response = await fetch(`${avatarServerUrl}/scanid`)
        if(!response.ok) {
            toaster.danger('Could not get scan id from the avatar server', {
                description: response.statusText,
            })
            console.log('error', response)
            return
        }
        const json = await response.json()
        const token = json['scan_id']
        const newAvatar = { name: name, id: uuid, token: token, articyId: '', sceneObject: '' }
        const newAvatars = [...avatars, newAvatar]
        setAvatars(newAvatars)
        saveAll(newAvatars)
    }

    const deleteAvatar = (avatarId) => {
        const newAvatars = avatars.filter(avatar => avatar.id !== avatarId)
        setAvatars(newAvatars)
        // Todo: delete downloaded avatar from project files
        // TODO: send delete request to TUD server?
        saveAll(newAvatars)
    }

    const assignSceneObject = (avatarId, sceneObjectId) => {
        const newAvatars = avatars.map(avatar => {
            if(avatar.id === avatarId) {
                avatar.sceneObject = sceneObjectId
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
            console.log('loadAvatarServerUrl', urlPref.value)
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
        <AvatarList avatars={avatars} updateQrCode={updateQrCode} deleteAvatar={deleteAvatar} sceneObjects={sceneObjects} assignSceneObject={assignSceneObject} />
        <AddAvatarForm addAvatar={addAvatar} />
    </AvatarEditorContainer>
}
