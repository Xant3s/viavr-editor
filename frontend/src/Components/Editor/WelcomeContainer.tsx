import { WelcomeContainerStyle } from "../StyledComponents/Editor/StyledEditor";
import { Button } from "evergreen-ui";
import { Row } from "../StyledComponents/Row";

const WelcomeContainer = ({hidden, setWelcomeContainer, setCapturePreferencesContainer, setTemplateRecommendationContainer}) => {
    return (
        <WelcomeContainerStyle hidden={hidden}>
            <h1>VIA-VR Editor</h1>
            <Row>
                <Button marginRight={16} appearance="primary" onClick={() => {
                    setWelcomeContainer(!hidden)
                    setCapturePreferencesContainer(hidden)
                    setTemplateRecommendationContainer(!hidden)
                }}>
                    Create New Project
                </Button>
                <Button marginRight={16} appearance="primary" onClick={() => {
                    setWelcomeContainer(!hidden)
                    setCapturePreferencesContainer(!hidden)
                    setTemplateRecommendationContainer(!hidden)
                    api.send(api.channels.toMain.openProject, 'res/Templates')}
                    }>
                    Open Project
                </Button>
                <Button marginRight={16} appearance="primary" onClick={() => {
                    setWelcomeContainer(!hidden)
                    setCapturePreferencesContainer(!hidden)
                    setTemplateRecommendationContainer(!hidden)
                    api.send(api.channels.toMain.openProjectFolder)}
                    }>
                    Open Project from Folder
                </Button>
            </Row>
        </WelcomeContainerStyle>
    )
}

export default WelcomeContainer;