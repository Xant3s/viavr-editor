import {useEffect, useState} from "react";
import {Button, Table, TrashIcon} from 'evergreen-ui'
import {AvatarInfo} from '../../@types/AvatarInfo'


export const AvatarEditor = ({hidden}) => {
    const [avatars, setAvatars] = useState<AvatarInfo[]>([])
    const [downloadedAvatars, setDownloadedAvatars] = useState<string[]>([])    // uuids

    useEffect(() => {
        const loadAvatars = async () => {
            const projectSettings = await api.invoke(api.channels.toMain.requestProjectSettings) as any
            const avatars = projectSettings.find(([k, _]) => k === 'dev.avatars')[1] || []
            setAvatars(avatars)
        }

        api.on(api.channels.fromMain.projectOpened, loadAvatars)
    }, [])

    return <div hidden={hidden} style={{backgroundColor: '#3a4048', height: 'calc(100vh - 76px)', margin: 0, padding: 10, textAlign: 'center', color: 'white'}}>
        <h1>Avatar Editor</h1>
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
                    <Table.Row key={avatar.uuid}>
                        <Table.TextCell>{avatar.name}</Table.TextCell>
                        <Table.TextCell>Please start download</Table.TextCell>
                        <Table.TextCell>
                            <Button appearance='primary'
                                    style={{width: '100%'}}
                                    onClick={() => {
                                    }}
                            >
                                Show QR Code
                            </Button>
                        </Table.TextCell>
                        <Table.TextCell>
                            <Button appearance='primary'
                                    style={{width: '100%'}}
                                    onClick={() => {
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
