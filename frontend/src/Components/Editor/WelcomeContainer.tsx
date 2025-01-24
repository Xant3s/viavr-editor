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
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {translate('tutorial_recommendation')}<br />
                {translate('jump_right_in')}
            </div>
            <Row style={{ marginBottom: '25px' }}>
                <Button onClick={startTutorial}>{translate('start_tutorial')}</Button>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
                <Button style={{ width: '190px' }} onClick={() => api.invoke(api.channels.toMain.createNewProject)}>
                    {translate('create_new_project')}
                </Button>
                <Button style={{ width: '190px' }} onClick={async () => {
                    await api.invoke(api.channels.toMain.openProject, 'Templates');
                }}>
                    {translate('open_project')}
                </Button>
                <Button style={{ width: '190px' }} onClick={() => api.invoke(api.channels.toMain.openProjectFolder)}>
                    {translate('open_project_from_folder')}
                </Button>
            </Row>
        </WelcomeContainerStyle>
    )
}
