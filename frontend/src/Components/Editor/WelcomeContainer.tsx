import { SpokeContainer, WelcomeContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { toaster } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'
import { Button } from '../StyledComponents/Button'
import { TabButton } from '../StyledComponents/TabButton'
import { Spoke } from './Spoke'
import React, { useEffect, useState } from 'react'
import { $$ } from '../../SpokeEditor/Spoke'

export const WelcomeContainer = ({ setPage }) => {

    const [viewID, setViewID] = useState(0)
    const [tutorialButton, setButtonText] = useState("Start Tutorial")
   

    const onProjectSelected = () => setViewID(1)

    const openIframeLink = () => {
        onProjectSelected()
        setButtonText("Continue Tutorial")
    };

    const closeSpoke = () => setViewID(0)
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
        <><WelcomeContainerStyle hidden={viewID === 1}>
            <h1>VIA-VR Editor</h1>
            <Row>
                <Button onClick={openIframeLink}>{tutorialButton}</Button>
            </Row>
            <Row>
                <Button onClick={() => setPage('preferences')}>
                    Create New Project
                </Button>
                <Button onClick={() => api.invoke(api.channels.toMain.openProject, 'res/Templates')}>
                    Open Project
                </Button>
                <Button onClick={() => api.invoke(api.channels.toMain.openProjectFolder)}>
                    Open Project from Folder
                </Button>
            </Row>
            <Row>
                <Button onClick={async () => downloadProjectTemplates()}>Download Template Projects</Button>
            </Row>
        </WelcomeContainerStyle><SpokeContainer id={'spoke-container'} hidden={viewID !== 1}>
            <div hidden={viewID !== 1} style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
                <div style={{ padding: 5, display: 'inline-block' }}>
                    <TabButton hidden={viewID !== 1} onClick={closeSpoke}> Back </TabButton>
                </div>
            </div>
            <Spoke hidden={viewID !== 1}isTutorial={true} />
        </SpokeContainer></>
    )
}
