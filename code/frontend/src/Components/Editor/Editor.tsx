import {useEffect, useState} from 'react'
import './styles.css'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'

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
        window.api.on('project-manager:project-created', () => onProjectSelected())
        window.api.on('project-manager:project-opened', () => onProjectSelected())
    })

    return (
        <>
        <div hidden={hideProjectSelectionPage}>
            <h1>Welcome</h1>
            <button onClick={() => window.api.send('project-manager:create-new-project')}>
                Create New Project
            </button>
            <button onClick={() => window.api.send('project-manager:open-project')}>
                Open Project
            </button>
            <button onClick={() => window.api.send('project-manager:open-project-folder')}>
                Open Project from Folder
            </button>
        </div>

        <div id={'spoke-container'} hidden={hideSpokeContainer}>
            <iframe id={'iframe-spoke'} title={'Spoke Editor'} src={'https://localhost:9090'} />
        </div>
        </>
    )
}
