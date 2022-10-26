import {useEffect, useState} from "react"
import {toString as QrToString} from 'qrcode'
import SVG from 'react-inlinesvg'
import {Button, Table, TrashIcon} from 'evergreen-ui'
import {AvatarInfo} from '../../@types/AvatarInfo'


export const AvatarEditor = ({hidden}) => {
    const [avatars, setAvatars] = useState<AvatarInfo[]>([])
    const [avatarsSettingUuid, setAvatarsSettingUuid] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')
    const [downloadedAvatars, setDownloadedAvatars] = useState<string[]>([])    // uuids

    useEffect(() => {
        const loadAvatars = async () => {
            const projectSettings = await api.invoke(api.channels.toMain.requestProjectSettings)
            const avatarsSetting = projectSettings.find(([k, _]) => k === 'dev.avatars')
            const avatars = avatarsSetting[1].value || []
            setAvatarsSettingUuid(avatarsSetting[1].uuid || '')
            setAvatars(avatars)
        }

        api.on(api.channels.fromMain.projectOpened, loadAvatars)
    }, [])

    const updateQrCode = (avatarId) => {
        const token = avatars.find(avatar => avatar.id === avatarId)?.token || ''
        QrToString(token, {type: 'svg'}, (err, svg) => {
            setQrCode(svg)
        })
    }

    const deleteAvatar = (avatarId) => {
        const newAvatars = avatars.filter(avatar => avatar.id !== avatarId)
        setAvatars(newAvatars)
        api.send(api.channels.toMain.changeProjectSetting, avatarsSettingUuid, newAvatars)
        // Todo: delete downloaded avatar from project files
    }

    return <div hidden={hidden} style={{backgroundColor: '#3a4048', height: 'calc(100vh - 76px)', margin: 0, padding: 10, textAlign: 'center', color: 'white'}}>
        <h1>Avatar Editor</h1>

        {qrCode !== '' &&
            <div>
                Scan this QR code with the VIA-VR avatar app:
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', marginTop: '5px'}}>
                    <SVG src={qrCode} width={256} height="auto"/>
                </div>
            </div>
        }

        <Table>
            <Table.Head>
                <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                <Table.TextHeaderCell>Status</Table.TextHeaderCell>
                <Table.TextHeaderCell>Show QR Code</Table.TextHeaderCell>
                <Table.TextHeaderCell>Download</Table.TextHeaderCell>
                <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body height={240} minWidth={'600px'}>
                {avatars.map((avatar : AvatarInfo) => (
                    <Table.Row key={avatar.id}>
                        <Table.TextCell>{avatar.name}</Table.TextCell>
                        <Table.TextCell>Please start download</Table.TextCell>
                        <Table.TextCell>
                            <Button appearance='primary'
                                    style={{width: '100%'}}
                                    onClick={() => {
                                        updateQrCode(avatar.id)
                                    }}
                            >
                                Show QR Code
                            </Button>
                        </Table.TextCell>
                        <Table.TextCell>
                            <Button appearance='primary'
                                    style={{width: '100%'}}
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
    </div>
}
