import { WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { toaster } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import React, { useState } from 'react'


export const WelcomeContainer = ({ setPage, startTutorial }) => {
    const [viewID, setViewID] = useState(0)
    const [tutorialButtonText, setButtonText] = useState("Start Tutorial")

    
    const handleStartTutorialButton = () => {
        // setButtonText('Continue Tutorial')
        startTutorial()
    }

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
        <WelcomeContainerStyle hidden={viewID === 1}>
            <h1>VIA-VR Editor</h1>
            <Row>
                <Button onClick={handleStartTutorialButton}>{tutorialButtonText}</Button>
            </Row>
            <Row>
                <Button onClick={() => setPage('preferences')}>
                    Create New Project
                </Button>
                <Button onClick={async () => {
                    console.log('ask backend to open project')
                    await api.invoke(api.channels.toMain.openProject, 'res/Templates');
                }}>
                    Open Project
                </Button>
                <Button onClick={() => api.invoke(api.channels.toMain.openProjectFolder)}>
                    Open Project from Folder
                </Button>
            </Row>
            <Row>
                <Button onClick={async () => downloadProjectTemplates()}>Download Template Projects</Button>
            </Row>
        </WelcomeContainerStyle>
    )
}
