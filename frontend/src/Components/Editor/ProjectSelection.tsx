import { CapturePreferecesContainer, TemplateRecommendationContainer, WelcomeContainer } from '../StyledComponents/Editor/StyledEditor'
import { Row } from '../StyledComponents/Row'
//import { Button } from '../StyledComponents/Button'
import { useState, useRef } from 'react'
import { Input } from '../StyledComponents/Input'
import { getTemplates } from '../RS/Communication'
import { Label, TemplateContent } from '../StyledComponents/Label'
import { data } from 'jquery'
import { Button, TextInput, toaster } from 'evergreen-ui'
import { PreferenceLabel } from '../StyledComponents/WelcomeScreen'

export const ProjectSelection = ({ hidden }) => {
    const [WelcomeContainerStatus, setWelcomeContainer] = useState(hidden)
    const [CapturePreferencesContainerStatus, setCapturePreferencesContainer] = useState(!hidden)
    const [TemplateRecommendationContainerStatus, setTemplateRecommendationContainer] = useState(!hidden)
    const [suitableTemplate, setSuitableTemplate] = useState('')
    const [suitableTemplateLink, setSuitableTemplateLink] = useState('')
    const [additionalTemplate1, setAdditionalTemplate1] = useState('')
    const [additionalTemplate1Link, setAdditionalTemplate1Link] = useState('')
    const [additionalTemplate2, setAdditionalTemplate2] = useState('')
    const [additionalTemplate2Link, setAdditionalTemplate2Link] = useState('')
    const [additionalTemplate3, setAdditionalTemplate3] = useState('')
    const [additionalTemplate3Link, setAdditionalTemplate3Link] = useState('')
    const [domainName, setDomainName] = useState('') 
    const [themeName, setThemeName] = useState('')
    const [keyword, setKeyword] = useState('')
    const [username, setUsername] = useState('')
    const [specialisation, setSpecialisation] = useState('')

    const additionalTemplateNames = [setAdditionalTemplate1, setAdditionalTemplate2, setAdditionalTemplate3]
    const additionalTemplateLinks = [setAdditionalTemplate1Link, setAdditionalTemplate2Link, setAdditionalTemplate3Link]

    const handleDomainChange = (event) => {
        setDomainName(event.target.value)
    }
    const handleThemeChange = (event) => {
        setThemeName(event.target.value)
    }
    const handleKeywordChange = (event) => {
        setKeyword(event.target.value)
    }
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handleSpecialisationChange = (event) => {
        setSpecialisation(event.target.value)
    }

    const openTemplate = (link : string) => {
        // Open the template in the editor
        console.log(link)
        api.send(api.channels.toMain.openProject, link);
        setWelcomeContainer(!hidden)
        setCapturePreferencesContainer(!hidden)
        setTemplateRecommendationContainer(!hidden)
        
    }

    const showTemplates = (response: any) => {
        // Convert response to json
        
        response.then((data) => {
            // Error handling
            if (data?.templates?.length === 0) {
                toaster.warning('No data received from server')
            }
            if (data?.errors?.[0]?.code === "ThemeNA") {
                toaster.warning('No templates found for the given theme. Here are some alternatives.')
            }
            if (data?.errors?.[0]?.code === "KeywordNA") {
                toaster.warning('No templates found for the given keyword. Here are some alternatives.')
            }
            // Fetch the first template name from the json response
            setSuitableTemplate(data?.templates?.[0]?.name ?? "")
            setSuitableTemplateLink(data?.templates?.[0]?.link ?? "")
            // Fetch the additional template names from the json response
            for (let i = 1; i < data?.templates?.length; i++) {
                additionalTemplateNames[i-1](data?.templates?.[i]?.name ?? "")
                additionalTemplateLinks[i-1](data?.templates?.[i]?.link ?? "")
            }
        })
    }

    const sendDataToServer = async event => {
        event.preventDefault()

        // Hide CapturePreferencesContainer and show TemplateRecommendationContainer
        setWelcomeContainer(!hidden)
        setCapturePreferencesContainer(!hidden)
        setTemplateRecommendationContainer(hidden)

        if (domainName === '' || themeName === '') {
            toaster.warning('Please fill in domain and theme fields')
            return
        }
        const preferences = {
            user: {
                username: username,
                specialisation: specialisation
            },
            session: {
                t_domain: domainName,
                t_theme: themeName,
                t_keyword: keyword
            }
        }
        const templateList = getTemplates(preferences)
        showTemplates(templateList)
        console.log(templateList)
        console.log('Recieved template list')
    }

    return (
    <>
    <WelcomeContainer hidden={WelcomeContainerStatus}>
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
    </WelcomeContainer>

    <CapturePreferecesContainer hidden={CapturePreferencesContainerStatus}>
        <div
            hidden={hidden}
            style={{
                backgroundColor: '#15171b',
                position: 'relative',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 10,
                color: 'white',
                textAlign: 'center',
                alignItems: 'center',
              }}
        >
            <h2>Preferences</h2>
            <h3>Please enter your details:</h3>
            <form onSubmit={sendDataToServer}>
                <PreferenceLabel htmlFor="username">Username</PreferenceLabel>
                <TextInput placeholder="Username" onChange={handleUsernameChange} /> <br />
                <PreferenceLabel htmlFor="specialisation">Specialisation</PreferenceLabel>
                <TextInput placeholder="Specialisation" onChange={handleSpecialisationChange} />  <br />
                <h3>What kind of project would you like to create?</h3>
                <PreferenceLabel htmlFor="domainName">Domain</PreferenceLabel>
                <TextInput placeholder="Domain Name (eg. Rehab)" onChange={handleDomainChange} required /> <br />
                <PreferenceLabel htmlFor="themeName">Theme</PreferenceLabel>
                <TextInput placeholder="Theme Name (eg. Speech)" onChange={handleThemeChange} required /> <br />
                <PreferenceLabel htmlFor="keyword">Keyword</PreferenceLabel>
                <TextInput placeholder="Keyword" onChange={handleKeywordChange} required /> <br /> <br />
                <Button marginRight={16} appearance="primary" type="submit">Save</Button>
                <Button marginRight={16} appearance="primary" onClick={() => {
                    setWelcomeContainer(hidden)
                    setCapturePreferencesContainer(!hidden)
                    setTemplateRecommendationContainer(!hidden)
                }}>
                    Back
                </Button>
            </form>
        </div>
    </CapturePreferecesContainer>

    <TemplateRecommendationContainer hidden={TemplateRecommendationContainerStatus}>
        <h1>Template Recommendations</h1>
        <h3>Based on your preferences, we recommend the following templates:</h3>
        <Row><Label>Most suitable template: </Label></Row>
        <Row>
            <Button marginRight={16} size='large' onClick={() => openTemplate(suitableTemplateLink)}>
            {suitableTemplate}    
            </Button>
        </Row>
        {/* <Row><TemplateContent id="suitable-template"></TemplateContent></Row> */}
        <Row><Label>Additional templates: </Label></Row>
        {/* <Row><TemplateContent id="additional-template"></TemplateContent></Row> */}
        <Row>
            <Button marginRight={16} size='large' onClick={() => openTemplate(additionalTemplate1Link)}>
            {additionalTemplate1}    
            </Button>
        </Row>
        <Row>
            <Button marginRight={16} size='large' onClick={() => openTemplate(additionalTemplate2Link)}>
            {additionalTemplate2}    
            </Button>
        </Row>
        <Row>
            <Button marginRight={16} size='large' onClick={() => openTemplate(additionalTemplate3Link)}>
            {additionalTemplate3}    
            </Button>
        </Row>
        <Row>
            <h2>Or</h2>
        </Row>
        <Row>
            <Button marginRight={16} appearance="primary" onClick={() => {
                setWelcomeContainer(!hidden)
                setCapturePreferencesContainer(!hidden)
                setTemplateRecommendationContainer(!hidden)
                api.send(api.channels.toMain.createNewProject)}
            }>
                Start new project
            </Button>
            <Button marginRight={16} appearance="primary" onClick={() => {
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
