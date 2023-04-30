import { WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Button, toaster } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'

export const WelcomeContainer = ({ setPage }) => {
    const downloadProjectTemplates = async () => {
        const status = await api.invoke(api.channels.toMain.downloadProjectTemplates)
        if (status === 200) {
            toaster.success('Download successful.', { duration: 5 })
        } else if (status === 503) {
            toaster.danger('Server unavailable or wrong address specified in preferences.', { duration: 5 })
        } else if (status === 418) {
            toaster.notify('Download aborted.', { duration: 5 })
        } else {
            toaster.danger('Something went wrong.', { duration: 5 })
        }
    }

    return (
        <WelcomeContainerStyle>
            <h1>VIA-VR Editor</h1>
            <Row>
                <Button marginRight={16} appearance="primary" onClick={() => setPage('preferences')}>
                    Create New Project
                </Button>
                <Button
                    marginRight={16}
                    appearance="primary"
                    onClick={() => api.send(api.channels.toMain.openProject, 'res/Templates')}
                >
                    Open Project
                </Button>
                <Button
                    marginRight={16}
                    appearance="primary"
                    onClick={() => api.send(api.channels.toMain.openProjectFolder)}
                >
                    Open Project from Folder
                </Button>
            </Row>
            <Row>
                <Button onClick={async () => downloadProjectTemplates()}>Download Template Projects</Button>
            </Row>
        </WelcomeContainerStyle>
    )
}
