import { WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { toaster } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import { useTranslation } from '../../LocalizationContext'


export const WelcomeContainer = ({ hidden, startTutorial }) => {
    const {translate, language, setLanguage} = useTranslation()
    
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
        <WelcomeContainerStyle hidden={hidden}>
            <h1>{translate('welcome')}</h1>
            <button onClick={() => setLanguage("en")}>English</button>
            <button onClick={() => setLanguage("de")}>Deutsch</button>
            <div style={{textAlign: 'center', marginBottom: '10px'}}>
                If you&apos;re new here we recommend going through the tutorial.<br />
                Otherwise, jump right in and create a project from scratch or from one of our templates.
            </div>
            <Row style={{marginBottom: '25px'}}>
                <Button onClick={startTutorial}>Start Tutorial</Button>
            </Row>
            <Row style={{marginBottom: '10px'}}>
                <Button style={{width: '190px'}} onClick={() => api.invoke(api.channels.toMain.createNewProject)}>
                      Create New Project
                </Button>
                <Button  style={{width: '190px'}} onClick={async () => {
                    await api.invoke(api.channels.toMain.openProject, 'Templates');
                }}>
                    Open Project
                </Button>
                <Button style={{width: '190px'}} onClick={() => api.invoke(api.channels.toMain.openProjectFolder)}>
                    Open Project from Folder
                </Button>
            </Row>
        </WelcomeContainerStyle>
    )
}
