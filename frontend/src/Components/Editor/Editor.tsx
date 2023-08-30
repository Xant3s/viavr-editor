import { useEffect, useState } from 'react'
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
    const [viewID, setViewID] = useState(0);
    const [isTutorial, setTutorial] = useState(false);
    const [spokeReady, setSpokeReady] = useState(false);

    const onProjectSelected = () => setViewID(1);
    const onSpokeReady = () => {
        setSpokeReady(true);
    };

    const onStartTutorial = async () => {
        setTutorial(true);
        while (!spokeReady) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        setViewID(1); 
    };


    useEffect(() => {
        const id1 = api.on(api.channels.fromMain.projectCreated, onProjectSelected)
        const id2 = api.on(api.channels.fromMain.projectOpened, onProjectSelected)

        return () => {
            api.removeListener(api.channels.fromMain.projectCreated, id1);
            api.removeListener(api.channels.fromMain.projectOpened, id2);
        }
    }, [])

    return (
        <>
            <TabHeader setId={setViewID} hidden={viewID === 0} />
            <div>
                <ProjectSelection hidden={viewID !== 0} startTutorial = {onStartTutorial} />
            </div>
            <MeshPreprocessing hidden={viewID !== 6} />
            <Spoke hidden={viewID !== 1} isTutorial={isTutorial} onSpokeReady={onSpokeReady} />
            <BehaviorEditor hidden={viewID !== 2} />
            <AvatarEditor hidden={viewID !== 3} />
            <Articy hidden={viewID !== 4} />
            <Share hidden={viewID !== 5} />
            <BuildDialog hidden={viewID !== 7} />
        </>
    )
}
