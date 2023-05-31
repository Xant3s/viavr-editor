import { useEffect, useState } from 'react'
import { toString as QrToString } from 'qrcode'
import { v4 as uuid4 } from 'uuid'
import { AvatarInfo } from '../../../@types/AvatarInfo'
import * as React from 'react'
import { AvatarEditorContainer } from './Styles'
import { QRCodePreview } from './QRCodePreview'
import { AddAvatarForm } from './AddAvatarForm'
import { AvatarList } from './AvatarList'


export const AvatarEditor = ({ hidden }) => {
    const [avatars, setAvatars] = useState<AvatarInfo[]>([])
    const [avatarsSettingUuid, setAvatarsSettingUuid] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')
    const [downloadedAvatars, setDownloadedAvatars] = useState<string[]>([])    // uuids
    const [sceneObjects, setSceneObjects] = React.useState<any[]>([])


    const loadSceneObjects = async () => {
        const objects = await api.invoke(api.channels.toMain.getSceneObjects)
        setSceneObjects(objects)
    }

    useEffect(() => {
        if(!hidden) loadSceneObjects()
    }, [hidden])

    useEffect(() => {
        const loadAvatars = async () => {
            // TODO: load all settings from project settings
            const projectSettings = await api.invoke(api.channels.toMain.requestProjectSettings)
            const avatarsSetting = projectSettings.find(([k, _]) => k === 'dev.avatars')
            const avatars = avatarsSetting[1].value || []
            setAvatarsSettingUuid(avatarsSetting[1].uuid || '')
            setAvatars(avatars)
            // TODO: check if avatars are downloaded
        }

        api.on(api.channels.fromMain.projectOpened, loadAvatars)
    }, [])

    const updateQrCode = (avatarId) => {
        const token = avatars.find(avatar => avatar.id === avatarId)?.token || ''
        QrToString(token, { type: 'svg' }, (err, svg) => {
            setQrCode(svg)
        })
    }

    const addAvatar = async (name: string) => {
        const uuid = uuid4()
        const token = 'dummy-token'   // TODO: request token from TUD server
        const newAvatar = { name: name, id: uuid, token: token, articyId: '', sceneObject: '' }
        const newAvatars = [...avatars, newAvatar]
        setAvatars(newAvatars)
        api.send(api.channels.toMain.changeProjectSetting, avatarsSettingUuid, newAvatars)
        // TODO: save all settings to project settings
    }

    const deleteAvatar = (avatarId) => {
        const newAvatars = avatars.filter(avatar => avatar.id !== avatarId)
        setAvatars(newAvatars)
        api.send(api.channels.toMain.changeProjectSetting, avatarsSettingUuid, newAvatars)
        // Todo: delete downloaded avatar from project files
    }

    const assignSceneObject = (avatarId, sceneObjectId) => {
        const newAvatars = avatars.map(avatar => {
            if(avatar.id === avatarId) {
                avatar.sceneObject = sceneObjectId
            }
            return avatar
        })
        setAvatars(newAvatars)
    }


    return <AvatarEditorContainer hidden={hidden}>
        <h1>Avatar Editor</h1>
        {qrCode !== '' && <QRCodePreview qrCode={qrCode} />}
        <AvatarList avatars={avatars} updateQrCode={updateQrCode} deleteAvatar={deleteAvatar} sceneObjects={sceneObjects} assignSceneObject={assignSceneObject} />
        <AddAvatarForm addAvatar={addAvatar} />
    </AvatarEditorContainer>
}
