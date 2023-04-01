import { CapturePreferecesContainer, TemplateRecommendationContainer, WelcomeContainer } from '../StyledComponents/Editor/StyledEditor'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import { useState } from 'react'
import { Input } from '../StyledComponents/Input'
import { getTemplates } from '../RS/Communication'
import { Label, TemplateContent } from '../StyledComponents/Label'
import { data } from 'jquery'

export const ProjectSelection = ({ hidden }) => {
    const [WelcomeContainerStatus, setWelcomeContainer] = useState(hidden)
    const [CapturePreferencesContainerStatus, setCapturePreferencesContainer] = useState(!hidden)
    const [TemplateRecommendationContainerStatus, setTemplateRecommendationContainer] = useState(!hidden)

    const savePreferences = async () => {
        /* 
            * Another function for fetching the recommendations
            * Append values to the project preferences -> Must be accessible from the preferences menu in Editor
        */
        const username = (document.getElementById("username") as HTMLInputElement).value
        const specialisation = (document.getElementById("specialisation") as HTMLInputElement).value
        const t_domain = (document.getElementById("t_domain") as HTMLInputElement).value
        const t_theme = (document.getElementById("t_theme") as HTMLInputElement).value
        const t_keyword = (document.getElementById("t_keyword") as HTMLInputElement).value

        const preferences = {
            user: {
                username: username,
                specialisation: specialisation
            },
            session: {
                t_domain: t_domain,
                t_theme: t_theme,
                t_keyword: t_keyword
            }
        }
        /* const json = JSON.stringify(preferences)
        console.log(json) */
        const templateList = getTemplates(preferences)
        showTemplates(templateList)
        console.log(templateList)
        console.log('Recieved template list')
        
        
    }

    const openTemplate = (link : string) => {
        // Open the template in the editor
        console.log(link)
        api.send(api.channels.toMain.openProject, link);
    }

    const showTemplates = (response: any) => {
        // Convert response to json
        const suitable_template = document.getElementById('suitable-template') as HTMLElement
        response.then((data) => {
            // Fetch the first template name from the json response
            suitable_template.innerHTML = data?.templates?.[0]?.name ?? ""
            suitable_template.onclick = () => {
                openTemplate(data['templates'][0].link)
                // api.send(api.channels.toMain.openProject, data?.templates?.[0]?.link ?? "")
                // alert('You have selected the ' + data['templates'][0].link + ' template')
            }
            // Clear the additional template list
            const additional_template_container = document.getElementById('additional-template');
            if (additional_template_container) {
                additional_template_container.innerHTML = '';
            }
            for (let i = 1; i < data?.templates?.length; i++) {
                // Fetch the rest of the template names from the json response
                const additional_template = document.createElement('TemplateContent');
                additional_template.innerHTML = data?.templates?.[i]?.name ?? "";
                additional_template.onclick = () => {
                    openTemplate(data['templates'][i].link)
                    //api.send(api.channels.toMain.openProject, data?.templates?.[i]?.link ?? "");
                    // alert('You have selected the ' + data?.templates?.[i]?.link + ' template')
                };
                additional_template_container?.appendChild(additional_template);
                // Add a line break after each additional template
                const linebreak = document.createElement('br');
                additional_template_container?.appendChild(linebreak);
            }
        })
    }

    return (
    <>
    <WelcomeContainer hidden={WelcomeContainerStatus}>
        <h1>VIA-VR Editor</h1>
        <Row>
            <Button onClick={() => {
                setWelcomeContainer(!hidden)
                setCapturePreferencesContainer(hidden)
                setTemplateRecommendationContainer(!hidden)
            }}>
                Create New Project
            </Button>
            <Button onClick={() => {
                setWelcomeContainer(!hidden)
                setCapturePreferencesContainer(!hidden)
                setTemplateRecommendationContainer(!hidden)
                api.send(api.channels.toMain.openProject, 'res/Templates')}
                }>
                Open Project
            </Button>
            <Button onClick={() => {
                setWelcomeContainer(!hidden)
                setCapturePreferencesContainer(!hidden)
                setTemplateRecommendationContainer(!hidden)
                api.send(api.channels.toMain.openProjectFolder)}
                }>
                Open Project from Folder
            </Button>
        </Row>
    </WelcomeContainer>

    <CapturePreferecesContainer hidden={CapturePreferencesContainerStatus}>
        <h1>Preferences</h1>
        <Row>
            <h3>Please enter your details:</h3>
        </Row>
        <Row>
            <Input id="username" name="username" placeholder="Username" />
            <Input id="specialisation" name="specialisation" placeholder="Specialisation" />
        </Row>
        <Row>
            <h3>What kind of application are you trying to make:</h3>
        </Row>
        <Row>
            <Input id="t_domain" name="t_domain" placeholder="Domain Name (eg. Rehab)" />
            <Input id="t_theme" name="t_theme" placeholder="Theme Name (eg. Speech)" />
            <Input id="t_keyword" name="t_keyword" placeholder="Keyword" />
        </Row>
        <Row>
            <Button onClick={() => {
                    setWelcomeContainer(!hidden)
                    setCapturePreferencesContainer(!hidden)
                    setTemplateRecommendationContainer(hidden)
                    savePreferences()
                }
            }>
                Save
            </Button>
            <Button onClick={() => {
                    setWelcomeContainer(hidden)
                    setCapturePreferencesContainer(!hidden)
                    setTemplateRecommendationContainer(!hidden)
                }
            }>
                Back
            </Button>
        </Row>
    </CapturePreferecesContainer>

    <TemplateRecommendationContainer hidden={TemplateRecommendationContainerStatus}>
        <h1>Template Recommendations</h1>
        <h3>Based on your preferences, we recommend the following templates:</h3>
        <Row><Label>Most suitable template: </Label></Row>
        <Row><TemplateContent id="suitable-template"></TemplateContent></Row>
        <Row><Label>Additional templates: </Label></Row>
        <Row><TemplateContent id="additional-template"></TemplateContent></Row>
        <Row>
            <h2>Or</h2>
        </Row>
        <Row>
            <Button onClick={() => api.send(api.channels.toMain.createNewProject)}>
                Start new project
            </Button>
            <Button onClick={() => {
                    setWelcomeContainer(!hidden)
                    setCapturePreferencesContainer(hidden)
                    setTemplateRecommendationContainer(!hidden)
                }
            }>
                Back
            </Button>
        </Row>
    </TemplateRecommendationContainer>
    </>
    )
}
