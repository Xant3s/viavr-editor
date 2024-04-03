import { WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Alert, toaster } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'


export const WelcomeContainer = ({ hidden, startTutorial }) => {
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
            <Alert
                intent="warning"
                title="Before you begin, please be aware:"
                marginBottom={32}
                style={{maxWidth: '50%'}}
            >
                Please be aware that this is a functional research prototype and not a finalized product.
                It is not designed for clinical use or to provide medical advice, diagnosis, or treatment. 
                The application is intended for demonstration and evaluation purposes only, 
                any use of it is strictly at your own risk. 
            </Alert>
            <h1>Welcome</h1>
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
