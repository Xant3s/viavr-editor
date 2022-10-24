import {WelcomeContainer} from '../StyledComponents/Editor/StyledEditor'
import {Row} from '../StyledComponents/Row'
import {Button} from '../StyledComponents/Button'

export const ProjectSelection = ({hidden}) => {
    return <WelcomeContainer hidden={hidden}>
        <h1>Welcome</h1>
        <Row>
            <Button onClick={() => api.send(api.channels.toMain.createNewProject)}>
                Create New Project
            </Button>
            <Button onClick={() => api.send(api.channels.toMain.openProject)}>
                Open Project
            </Button>
            <Button onClick={() => api.send(api.channels.toMain.openProjectFolder)}>
                Open Project from Folder
            </Button>
        </Row>
    </WelcomeContainer>
}
