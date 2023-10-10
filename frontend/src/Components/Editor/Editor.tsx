import { useEffect, useState } from 'react'
import { ProjectSelection } from './ProjectSelection'
import { Spoke } from './Spoke'
import { TabHeader } from './TabHeader'
import { BehaviorEditor } from './BehaviorEditor/BehaviorEditor'
import { AvatarEditor } from './AvatarEditor/AvatarEditor'
import { Articy } from './Articy'
import { Share } from './Share'
import { BuildDialog } from '../BuildDialog/BuildDialog'
import { MeshPreprocessing } from './MeshPreprocessing/MeshPreprocessing'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { SceneExport } from '../../SpokeEditor/SceneExport'
import { ModalWindow } from '../Utils/UI'


export const Editor = () => {
    const [viewID, setViewID] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [isTutorial, setTutorial] = useState(false)
    const [loadSceneWhenSpokeIsReady, setLoadSceneWhenSpokeIsReady] = useState(false)
    let sceneExport : SceneExport | null = null
    
    
    const returnToWelcomeScreen = () => {
        setViewID(0)
        setTutorial(false)
    }

    const onStartTutorial = async () => {
        setTutorial(true)
        setViewID(1)
    }

    const onSpokeReady = async () => {
        if(!SpokeAPI.Instance.IsReady) return
        SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.projectPageSelected, async () => {
            sceneExport = sceneExport || new SceneExport()  // ensures there is only one instance of SceneExport
            if(loadSceneWhenSpokeIsReady) {
                setLoadSceneWhenSpokeIsReady(false)
                await loadScene()
            }
        })
    }

    const loadScene = async () => {
        const sceneFileContents = await api.invoke(api.channels.toMain.getSceneFileContents)
        if(sceneFileContents === '') {
            console.log('No scene to load. Creating a new one')
            SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.createScene)
            return
        }
        SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.loadScene, sceneFileContents)
    }

    const onTryingToQuit = () =>{
        console.log("Got here")
        setShowModal(true)}

    useEffect(() => {
        const onProjectSelected = async () => {
            setViewID(1)
            if(SpokeAPI.Instance.IsReady) {
                await loadScene()
            } else {
                setLoadSceneWhenSpokeIsReady(true)
            }
        }
        
        const id1 = api.on(api.channels.fromMain.projectCreated, onProjectSelected)
        const id2 = api.on(api.channels.fromMain.projectOpened, onProjectSelected)
        const id3 = api.on(api.channels.fromMain.tryExitApplication, onTryingToQuit)

        return () => {
            api.removeListener(api.channels.fromMain.projectCreated, id1)
            api.removeListener(api.channels.fromMain.projectOpened, id2)
            api.removeListener(api.channels.fromMain.tryExitApplication, id3)
        }
    }, [])

    const handleSaveAndContinue = async () => {
        await api.invoke(api.channels.toMain.saveScene)
        await SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.saveScene)
        await api.invoke(api.channels.toMain.saveProject)
        await api.invoke(api.channels.toMain.exitApplication)
    };

    const handleContinueWithoutSaving = async () => {
        await api.invoke(api.channels.toMain.exitApplication)
    };

    return (
        <>
            <TabHeader setId={setViewID} hidden={viewID === 0} isInTutorialMode={isTutorial} returnToWelcomeScreen={returnToWelcomeScreen} />
            <div>
                <ProjectSelection hidden={viewID !== 0} startTutorial={onStartTutorial} />
            </div>
            <MeshPreprocessing hidden={viewID !== 6} />
            <Spoke hidden={viewID !== 1} isTutorial={isTutorial} onSpokeReady={onSpokeReady} />
            <BehaviorEditor hidden={viewID !== 2} />
            <AvatarEditor hidden={viewID !== 3} />
            <Articy hidden={viewID !== 4} />
            <Share hidden={viewID !== 5} />
            <BuildDialog hidden={viewID !== 7} />
            {showModal && <ModalWindow closeModal={() => setShowModal(false)}
                                       onSaveAndContinue={handleSaveAndContinue}
                                       onContinueWithoutSaving={handleContinueWithoutSaving}
                                       upperTitle="Project should be saved before closing."/>}
        </>
    )
}
