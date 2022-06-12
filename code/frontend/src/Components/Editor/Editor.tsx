import {useEffect, useState} from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import { Button } from '../StyledComponents/Button'
import {SpokeContainer, SpokeIframe, WelcomeContainer} from '../StyledComponents/Editor/StyledEditor'
import { Row } from '../StyledComponents/Row'

export const Editor = () => {
    const [hideProjectSelectionPage, setHideProjectSelectionPage] = useState(false)
    const [hideSpokeContainer, setHideSpokeContainer] = useState(true)

    const onProjectSelected = () => {
        setHideProjectSelectionPage(true)
        setHideSpokeContainer(false)
        new SceneEditor()
        new SceneExport()
        new SceneLoadingPage()
    }

    useEffect(() => {
        api.on(api.channels.fromMain.projectCreated, () => onProjectSelected())
        api.on(api.channels.fromMain.projectOpened, () => onProjectSelected())
    })

    return (
        <>
        <WelcomeContainer hidden={hideProjectSelectionPage}>
            <h1>Welcome</h1>
            <Row>
                <Button onClick={() => api.send(api.channels.toMain.createNewProject)}>
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

        <SpokeContainer id={'spoke-container'} hidden={hideSpokeContainer}>
            <SpokeIframe id={'iframe-spoke'} title={'Spoke Editor'} src={'https://localhost:9090'} />
        </SpokeContainer>
        </>
    )
}
