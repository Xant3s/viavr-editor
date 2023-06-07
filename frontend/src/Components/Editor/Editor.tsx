import { useEffect, useState } from 'react'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import { SceneExport } from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import { ProjectSelection } from './ProjectSelection'
import { Spoke } from './Spoke'
import { TabHeader } from './TabHeader'
import { BehaviorEditor } from './BehaviorEditor/BehaviorEditor'
import { AvatarEditor } from './AvatarEditor/AvatarEditor'
import { Articy } from './Articy'
import { Share } from './Share'
import { BuildDialog } from '../BuildDialog/BuildDialog'
import { MeshPreprocessing } from './MeshPreprocessing/MeshPreprocessing'


export const Editor = () => {
    const [viewID, setViewID] = useState(0)

    const onProjectSelected = () => setViewID(1)

    useEffect(() => {
        api.on(api.channels.fromMain.projectCreated, onProjectSelected)
        api.on(api.channels.fromMain.projectOpened, onProjectSelected)

        return () => {
            api.off(api.channels.fromMain.projectCreated, onProjectSelected);
            api.off(api.channels.fromMain.projectOpened, onProjectSelected);
        }
    }, [])

    return (
        <>
            <TabHeader setId={setViewID} hidden={viewID === 0} />
            <div>
                <ProjectSelection hidden={viewID !== 0} />
            </div>
            <MeshPreprocessing hidden={viewID !== 6} />
            <Spoke hidden={viewID !== 1} />
            <BehaviorEditor hidden={viewID !== 2} />
            <AvatarEditor hidden={viewID !== 3} />
            <Articy hidden={viewID !== 4} />
            <Share hidden={viewID !== 5} />
            <BuildDialog hidden={viewID !== 7} />
        </>
    )
}
