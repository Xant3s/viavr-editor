import { WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Button } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'

export const WelcomeContainer = ({ setPage }) => {
    return (
        <WelcomeContainerStyle>
            <h1>VIA-VR Editor</h1>
            <Row>
                <Button marginRight={16} appearance='primary' onClick={() => setPage('preferences')}>
                    Create New Project
                </Button>
                <Button marginRight={16} appearance='primary' onClick={() =>
                        api.send(api.channels.toMain.openProject, 'res/Templates')
                }>
                    Open Project
                </Button>
                <Button marginRight={16} appearance='primary' onClick={() =>
                        api.send(api.channels.toMain.openProjectFolder)
                }>
                    Open Project from Folder
                </Button>
            </Row>
        </WelcomeContainerStyle>
    )
}
