import {useEffect, useState} from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import {SpokeContainer, SpokeIframe} from '../StyledComponents/Editor/StyledEditor'

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
        <div hidden={hideProjectSelectionPage}>
            <h1>Welcome</h1>
            <button onClick={() => api.send(api.channels.toMain.createNewProject)}>
                Create New Project
            </button>
            <button onClick={() => api.send(api.channels.toMain.openProject)}>
                Open Project
            </button>
            <button onClick={() => api.send(api.channels.toMain.openProjectFolder)}>
                Open Project from Folder
            </button>
        </div>

        <SpokeContainer id={'spoke-container'} hidden={hideSpokeContainer}>
            <SpokeIframe id={'iframe-spoke'} title={'Spoke Editor'} src={'https://localhost:9090'} />
        </SpokeContainer>
        </>
    )
}
