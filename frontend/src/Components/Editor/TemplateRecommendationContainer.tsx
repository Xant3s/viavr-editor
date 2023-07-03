import { Button, toaster } from 'evergreen-ui'
import { TemplateRecommendationContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Label } from '../StyledComponents/Label'
import { Row } from '../StyledComponents/Row'
import { useEffect, useState } from 'react'
import { getTemplates } from '../RS/Communication'

export const TemplateRecommendationContainer = ({setPage, preferences}) => {
    const [suitableTemplate, setSuitableTemplate] = useState('')
    const [suitableTemplateLink, setSuitableTemplateLink] = useState('')
    const [additionalTemplate1, setAdditionalTemplate1] = useState('')
    const [additionalTemplate1Link, setAdditionalTemplate1Link] = useState('')
    const [additionalTemplate2, setAdditionalTemplate2] = useState('')
    const [additionalTemplate2Link, setAdditionalTemplate2Link] = useState('')
    const [additionalTemplate3, setAdditionalTemplate3] = useState('')
    const [additionalTemplate3Link, setAdditionalTemplate3Link] = useState('')


    const openTemplate = (link : string) => {
        api.invoke(api.channels.toMain.openProject, link)
    }

    useEffect(() => {
        const queryTemplates = async () => {
            const templateList = await getTemplates(preferences)

            if(templateList?.templates?.length === 0) {
                toaster.warning('No data received from server')
            }
            if(templateList?.errors?.[0]?.code === 'ThemeNA') {
                toaster.warning('No templates found for the given theme. Here are some alternatives.')
            }
            if(templateList?.errors?.[0]?.code === 'KeywordNA') {
                toaster.warning('No templates found for the given keyword. Here are some alternatives.')
            }
            // Fetch the first template name from the json response
            setSuitableTemplate(templateList?.templates?.[0]?.name ?? '')
            setSuitableTemplateLink(templateList?.templates?.[0]?.link ?? '')
            // Fetch the additional template names from the json response
            const additionalTemplateNames = [setAdditionalTemplate1, setAdditionalTemplate2, setAdditionalTemplate3]
            const additionalTemplateLinks = [setAdditionalTemplate1Link, setAdditionalTemplate2Link, setAdditionalTemplate3Link]
            for(let i = 1; i < templateList?.templates?.length; i++) {
                additionalTemplateNames[i - 1](templateList?.templates?.[i]?.name ?? '')
                additionalTemplateLinks[i - 1](templateList?.templates?.[i]?.link ?? '')
            }
        }
       queryTemplates()
    }, [preferences])


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
                <Button marginRight={16} appearance="primary" onClick={() => api.invoke(api.channels.toMain.createNewProject)}>
                    Start new project
                </Button>
                <Button marginRight={16} appearance="primary" onClick={() => setPage('preferences')}>Back</Button>
            </Row>
        </TemplateRecommendationContainerStyle>
    )
}
