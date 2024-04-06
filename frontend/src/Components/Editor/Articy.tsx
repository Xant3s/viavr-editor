import { Button, Table } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { AvatarInfo } from '../../@types/AvatarInfo'
import { MenuItem, Select } from '@mui/material'

class Dialog {
    articyId = ''
    name = ''
}


export const Articy = ({ hidden }) => {
    const [isDisabled, setDisabled] = useState(false);
    const [dialogs, setDialogs] = useState<Dialog[]>([])
    const [avatars, setAvatars] = useState<AvatarInfo[]>([])

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

    useEffect(() => {
        api.on(api.channels.fromMain.externalWindowOpened, () => setDisabled(true))
        api.on(api.channels.fromMain.externalWindowClosed, () => setDisabled(false))
    }, [])

    const openArticyEditor = () => {
        api.invoke(api.channels.toMain.openArticyEditor)
    }
    
    const getDialogName = (dialogId: string) => {
        const dialog = dialogs.find(dialog => dialog.articyId === dialogId)
        if(dialog === undefined) return ''
        return dialog.name
    }

    const assignDialog = (avatarToken: string, dialogId: string) => {
        updateAvatar(avatarToken, (avatar: AvatarInfo) => {
            avatar.dialogueId = dialogId
            return avatar
        })
    }

    const updateAvatar = (avatarToken: string, modifier: (a: AvatarInfo) => AvatarInfo) => {
        const newAvatars = avatars.map(avatar => {
            if(avatar.token === avatarToken) {
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

    useEffect(() => {
        const loadDialogs = async () => {
            const dialogs = await api.invoke(api.channels.toMain.getBuildSetting, 'dialogues')
            if(dialogs === undefined) return
            setDialogs(dialogs)
        }

        const loadAvatars = async () => {
            const avatars = await api.invoke(api.channels.toMain.getBuildSetting, 'avatars')
            if(avatars === undefined) return
            setAvatars(avatars)
        }

        if(!hidden && !isDisabled) {
            loadDialogs()
            loadAvatars()
        }
    }, [hidden, isDisabled])

    return <div hidden={hidden} style={{
        backgroundColor: '#3a4048',
        height: 'calc(100vh - 76px)',
        margin: 0,
        padding: 10,
        textAlign: 'center',
        color: 'white',
    }}>
        <h1>Articy</h1>
        <Table style={{marginBottom: '20px', borderColor:'#6C737A'}}>
            <Table.Head style={tableHeaderStyle}>
                <Table.TextHeaderCell>Character</Table.TextHeaderCell>
                <Table.TextHeaderCell>Dialog</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body minHeight={240} maxHeight={320} minWidth={'600px'}>
                {avatars.map((avatar, index) => (
                    <Table.Row key={index} style={tableRowStyle}>
                        <Table.TextCell>
                            <p style={{color:'white'}}>
                                <b>{avatar.name}</b>
                            </p>
                        </Table.TextCell>
                        <Table.TextCell>
                            <Select id="avatar" value={avatar.dialogueId} style={{
                                minWidth: '100px',
                                height: '30px',
                                backgroundColor: avatar.dialogueId !== '' ? 'initial' : 'red'
                            }}
                                    onChange={e => assignDialog(avatar.token, e.target.value)} required>
                                {dialogs.map((dialog, index) => (
                                    <MenuItem key={index} value={dialog.articyId}>
                                        {dialog.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>

        <Button disabled={isDisabled} appearance='primary' onClick={() => openArticyEditor()}>Open Articy Editor</Button>

    </div>
}
