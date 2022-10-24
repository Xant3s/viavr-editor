import {useEffect, useState} from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import {ProjectSelection} from './ProjectSelection'
import {Spoke} from './Spoke'

export const Editor = () => {
    const [viewID, setViewID] = useState(0)

    const onProjectSelected = () => {
        setViewID(1)
        new SceneEditor()
        new SceneExport()
        new SceneLoadingPage()
    }

    useEffect(() => {
        api.on(api.channels.fromMain.projectCreated, () => onProjectSelected())
        api.on(api.channels.fromMain.projectOpened, () => onProjectSelected())
    })

    return <>
        <ProjectSelection hidden={viewID !== 0}/>
        <Spoke hidden={viewID !== 1}/>
    </>
}
