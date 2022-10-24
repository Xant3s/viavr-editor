import {useEffect, useState} from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import {SceneExport} from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import {ProjectSelection} from './ProjectSelection'
import {Spoke} from './Spoke'
import {TabHeader} from './TabHeader'
import {BehaviorEditor} from './BehaviorEditor'
import {AvatarEditor} from './AvatarEditor'
import {Articy} from './Articy'
import {Share} from './Share'

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
        <TabHeader setId={setViewID}/>
        <ProjectSelection hidden={viewID !== 0}/>
        <Spoke hidden={viewID !== 1}/>
        <BehaviorEditor hidden={viewID !== 2}/>
        <AvatarEditor hidden={viewID !== 3}/>
        <Articy hidden={viewID !== 4}/>
        <Share hidden={viewID !== 5}/>
    </>
}
