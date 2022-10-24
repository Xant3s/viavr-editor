import {useEffect, useState} from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import {ProjectSelection} from './ProjectSelection'
import {Spoke} from './Spoke'

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

    return <>
        <ProjectSelection hidden={hideProjectSelectionPage}/>
        <Spoke hidden={hideSpokeContainer}/>
    </>
}
