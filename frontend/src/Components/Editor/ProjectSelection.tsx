import { CapturePreferecesContainer, TemplateRecommendationContainer, WelcomeContainer } from '../StyledComponents/Editor/StyledEditor'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import { useState } from 'react'
import { Input } from '../StyledComponents/Input'
import { getTemplates } from '../RS/Communication'

export const ProjectSelection = ({ hidden }) => {
    const [hideWelcomeContainer, setHideWelcomeContainer] = useState(hidden)
    const [hideCapturePreferencesContainer, setHideCapturePreferencesContainer] = useState(!hidden)
    const [hideTemplateRecommendationContainer, setHideTemplateRecommendationContainer] = useState(!hidden)

    const savePreferences = () => {
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
        console.log(templateList)
    }

    return (
    <>
    <WelcomeContainer hidden={hideWelcomeContainer}>
        <h1>VIA-VR Editor</h1>
        <Row>
            <Button onClick={() => {
                setHideWelcomeContainer(!hidden)
                setHideCapturePreferencesContainer(hidden)
                setHideTemplateRecommendationContainer(!hidden)
            }}>
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

    <CapturePreferecesContainer hidden={hideCapturePreferencesContainer}>
        <h1>Preferences</h1>
        <Row>
            <h3>Please enter your details:</h3>
        </Row>
        <Row>
            <Input id="username" name="username" placeholder="Username" />
            <Input id="specialisation" name="specialisation" placeholder="Specialisation" />
        </Row>
        <Row>
            <h3>What are you trying to make:</h3>
        </Row>
        <Row>
            <Input id="t_domain" name="t_domain" placeholder="Domain Name (eg. Rehab)" />
            <Input id="t_theme" name="t_theme" placeholder="Theme Name (eg. Speech)" />
            <Input id="t_keyword" name="t_keyword" placeholder="Keyword" />
        </Row>
        <Row>
            <Button onClick={() => {
                    setHideWelcomeContainer(!hidden)
                    setHideCapturePreferencesContainer(!hidden)
                    setHideTemplateRecommendationContainer(hidden)
                    savePreferences()
                }
            }>
                Save
            </Button>
            <Button onClick={() => {
                    setHideWelcomeContainer(hidden)
                    setHideCapturePreferencesContainer(!hidden)
                    setHideTemplateRecommendationContainer(!hidden)
                }
            }>
                Back
            </Button>
        </Row>
    </CapturePreferecesContainer>

    <TemplateRecommendationContainer hidden={hideTemplateRecommendationContainer}>
        <h1>Template Recommendations</h1>
        <Row>
            <Button onClick={() => api.send(api.channels.toMain.createNewProject)}>
                Create Project
            </Button>
            <Button onClick={() => {
                    setHideWelcomeContainer(!hidden)
                    setHideCapturePreferencesContainer(hidden)
                    setHideTemplateRecommendationContainer(!hidden)
                }
            }>
                Back
            </Button>
        </Row>
    </TemplateRecommendationContainer>
    </>
    )
}
