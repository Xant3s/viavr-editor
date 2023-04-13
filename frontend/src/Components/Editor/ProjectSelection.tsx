import { WelcomeContainer } from '../StyledComponents/Editor/StyledEditor'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import { toaster } from 'evergreen-ui'

export const ProjectSelection = ({ hidden }) => {
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
        <WelcomeContainer hidden={hidden}>
            <h1>Welcome</h1>
            <Row>
                <Button onClick={() => api.send(api.channels.toMain.createNewProject)}>Create New Project</Button>
                <Button onClick={() => api.send(api.channels.toMain.openProject)}>Open Project</Button>
                <Button onClick={() => api.send(api.channels.toMain.openProjectFolder)}>
                    Open Project from Folder
                </Button>
            </Row>
            <Row>
                <Button onClick={async () => downloadProjectTemplates()}>Download Template Projects</Button>
            </Row>
        </WelcomeContainer>
    )
}
