import { Button } from 'evergreen-ui'
import { TemplateRecommendationContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Label } from '../StyledComponents/Label'
import { Row } from '../StyledComponents/Row'

export const TemplateRecommendationContainer = ({
    setPage,
    suitableTemplate,
    suitableTemplateLink,
    additionalTemplate1,
    additionalTemplate1Link,
    additionalTemplate2,
    additionalTemplate2Link,
    additionalTemplate3,
    additionalTemplate3Link,
    openTemplate,
}) => {
    return (
        <TemplateRecommendationContainerStyle>
            <h1>Template Recommendations</h1>
            <h3>
                Based on your preferences, we recommend the following templates:
            </h3>
            <Row>
                <Label>Most suitable template: </Label>
            </Row>
            <Row>
                <Button marginRight={16} size="large" onClick={() => openTemplate(suitableTemplateLink)}>
                    {suitableTemplate}
                </Button>
            </Row>
            {/* <Row><TemplateContent id="suitable-template"></TemplateContent></Row> */}
            <Row>
                <Label>Additional templates: </Label>
            </Row>
            {/* <Row><TemplateContent id="additional-template"></TemplateContent></Row> */}
            <Row>
                <Button marginRight={16} size="large" onClick={() => openTemplate(additionalTemplate1Link)}>
                    {additionalTemplate1}
                </Button>
            </Row>
            <Row>
                <Button marginRight={16} size="large" onClick={() => openTemplate(additionalTemplate2Link)}>
                    {additionalTemplate2}
                </Button>
            </Row>
            <Row>
                <Button marginRight={16} size="large" onClick={() => openTemplate(additionalTemplate3Link)}>
                    {additionalTemplate3}
                </Button>
            </Row>
            <Row>
                <h2>Or</h2>
            </Row>
            <Row>
                <Button marginRight={16} appearance="primary" onClick={() => api.send(api.channels.toMain.createNewProject)}>
                    Start new project
                </Button>
                <Button marginRight={16} appearance="primary" onClick={() => setPage('preferences')}>Back</Button>
            </Row>
        </TemplateRecommendationContainerStyle>
    )
}
