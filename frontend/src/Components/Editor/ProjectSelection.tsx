import { useState } from 'react'
import { getTemplates } from '../RS/Communication'
import { toaster } from 'evergreen-ui'
import WelcomeContainer from './WelcomeContainer'
import CapturePreferencesContainer from './CapturePreferencesContainer'
import TemplateRecommendationContainer from './TemplateRecommendationContainer'

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


    const openTemplate = (link : string) => {
        // Open the template in the editor
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
    }

    return (
    <>
    <WelcomeContainer 
        hidden={WelcomeContainerStatus}
        setWelcomeContainer={setWelcomeContainer}
        setCapturePreferencesContainer={setCapturePreferencesContainer}
        setTemplateRecommendationContainer={setTemplateRecommendationContainer}
    />
        
    <CapturePreferencesContainer 
        hidden={CapturePreferencesContainerStatus}
        setWelcomeContainer={setWelcomeContainer}
        setCapturePreferencesContainer={setCapturePreferencesContainer}
        setTemplateRecommendationContainer={setTemplateRecommendationContainer}
        sendDataToServer={sendDataToServer}
        handleDomainChange={e => setDomainName(e.target.value)}
        handleThemeChange={e => setThemeName(e.target.value)}
        handleKeywordChange={e => setKeyword(e.target.value)}
        handleUsernameChange={e => setUsername(e.target.value)}
        handleSpecialisationChange={e => setSpecialisation(e.target.value)}
    />

    <TemplateRecommendationContainer 
        hidden={TemplateRecommendationContainerStatus}
        setWelcomeContainer={setWelcomeContainer}
        setCapturePreferencesContainer={setCapturePreferencesContainer}
        setTemplateRecommendationContainer={setTemplateRecommendationContainer}
        openTemplate={openTemplate}
        suitableTemplate={suitableTemplate}
        suitableTemplateLink={suitableTemplateLink}
        additionalTemplate1={additionalTemplate1}
        additionalTemplate1Link={additionalTemplate1Link}
        additionalTemplate2={additionalTemplate2}
        additionalTemplate2Link={additionalTemplate2Link}
        additionalTemplate3={additionalTemplate3}
        additionalTemplate3Link={additionalTemplate3Link}
        />
    </>
    )
}
