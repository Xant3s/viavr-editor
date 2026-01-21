import { useEffect, useState } from 'react'
import { Spoke } from './Spoke'
import { TabHeader } from './TabHeader'
import { BehaviorEditor } from './BehaviorEditor/BehaviorEditor'
import { AvatarEditor } from './AvatarEditor/AvatarEditor'
import { Articy } from './Articy'
import { ArticyOverlay } from './ArticyOverlay'
import { BuildDialog } from '../BuildDialog/BuildDialog'
import { MeshPreprocessing } from './MeshPreprocessing/MeshPreprocessing'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { SceneExport } from '../../SpokeEditor/SceneExport'
import { ModalWindow } from '../Utils/UI'
import { WelcomeContainer } from './WelcomeContainer'
import { useTranslation } from '../../LocalizationContext'
import { toaster } from 'evergreen-ui'


export const Editor = () => {
    const { translate } = useTranslation()
    const [viewID, setViewID] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [isTutorial, setTutorial] = useState(false)
    const [loadSceneWhenSpokeIsReady, setLoadSceneWhenSpokeIsReady] = useState(false)
    const [isExternalWindowOpen, setIsExternalWindowOpen] = useState(false)
    let sceneExport: SceneExport | null = null


    const returnToWelcomeScreen = () => {
        setViewID(0)
        setTutorial(false)
        SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.abortTutorial)
    }

    const onStartTutorial = async () => {
        setTutorial(true)
        setViewID(1)
    }

    const onSpokeReady = async () => {
        sceneExport = sceneExport || new SceneExport()  // ensures there is only one instance of SceneExport
        if (loadSceneWhenSpokeIsReady) {
            setLoadSceneWhenSpokeIsReady(false)
            await loadScene()
        }
    }

    const loadScene = async () => {
        const sceneFileContents = await api.invoke(api.channels.toMain.getSceneFileContents)
        if (sceneFileContents === '') {
            console.log('No scene to load. Creating a new one')
            SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.createScene)
            return
        }
        SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.loadScene, sceneFileContents)
    }

    const onTryingToQuit = () => {
        setShowModal(true)
    }

    useEffect(() => {
        const checkPackageRegistryOnProjectLoad = async () => {
            try {
                const prefs = await api.invoke(api.channels.toMain.requestPreferences) as [string, any][]

                // Get the current language from preferences for correct translation
                const langPref = prefs.find(p => p[0] === 'dev.language')
                let lang = langPref?.[1]?.value || 'en'
                if (lang === 'unknown' || lang === 'system') {
                    lang = await api.invoke(api.channels.toMain.detectSystemLanguage) || 'en'
                }
                const { translationsData } = await import('../../TranslationsData')
                const translations = translationsData[lang] || translationsData['en']
                const localTranslate = (key: string) => translations[key] || key

                const packageRegistriesPref = prefs.find(p => p[0] === 'packageRegistries')
                if (packageRegistriesPref) {
                    const registries = packageRegistriesPref[1].value as any[]
                    for (const registry of registries) {
                        const url = registry.packageRegistryUrl?.value
                        if (url) {
                            const result = await api.invoke(api.channels.toMain.checkPackageRegistryReachable, url) as { reachable: boolean, error?: string }
                            if (!result.reachable) {
                                if (result.error === 'empty') {
                                    toaster.warning(localTranslate('prefs_registry_empty'), { duration: 8 })
                                } else {
                                    toaster.warning(localTranslate('prefs_registry_unreachable').replace('{url}', url), { duration: 8 })
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to check package registry reachability:', e)
            }
        }

        const onProjectSelected = async () => {
            setViewID(1)
            checkPackageRegistryOnProjectLoad()
            if (SpokeAPI.Instance.IsReady) {
                await loadScene()
            } else {
                setLoadSceneWhenSpokeIsReady(true)
            }
        }

        const id1 = api.on(api.channels.fromMain.projectCreated, onProjectSelected)
        const id2 = api.on(api.channels.fromMain.projectOpened, onProjectSelected)
        const id3 = api.on(api.channels.fromMain.tryExitApplication, onTryingToQuit)
        const id4 = api.on(api.channels.fromMain.projectUnloaded, returnToWelcomeScreen)

        return () => {
            api.removeListener(api.channels.fromMain.projectCreated, id1)
            api.removeListener(api.channels.fromMain.projectOpened, id2)
            api.removeListener(api.channels.fromMain.tryExitApplication, id3)
            api.removeListener(api.channels.fromMain.projectUnloaded, id4)
        }
    }, [])

    useEffect(() => {
        const onExternalWindowOpened = () => setIsExternalWindowOpen(true)
        const onExternalWindowClosed = () => setIsExternalWindowOpen(false)

        const id1 = api.on(api.channels.fromMain.externalWindowOpened, onExternalWindowOpened)
        const id2 = api.on(api.channels.fromMain.externalWindowClosed, onExternalWindowClosed)

        return () => {
            api.removeListener(api.channels.fromMain.externalWindowOpened, id1)
            api.removeListener(api.channels.fromMain.externalWindowClosed, id2)
        }
    }, [])

    const handleSaveAndContinue = async () => {
        await api.invoke(api.channels.toMain.saveScene)
        await SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.saveScene)
        await api.invoke(api.channels.toMain.saveProject)
        await api.invoke(api.channels.toMain.exitApplication)
    }

    const handleContinueWithoutSaving = async () => {
        await api.invoke(api.channels.toMain.exitApplication)
    }

    return (
        <>
            <TabHeader setId={setViewID} currentViewId={viewID} hidden={viewID === 0} isInTutorialMode={isTutorial}
                returnToWelcomeScreen={returnToWelcomeScreen} />
            <WelcomeContainer hidden={viewID !== 0} startTutorial={onStartTutorial} />
            <div hidden={viewID === 0} style={{ marginBottom: '35px' }}></div>
            <MeshPreprocessing hidden={viewID !== 6} />
            <Spoke hidden={viewID !== 1} isTutorial={isTutorial} onSpokeReady={onSpokeReady}
                returnToWelcomeScreen={returnToWelcomeScreen} />
            <BehaviorEditor hidden={viewID !== 2} />
            <AvatarEditor hidden={viewID !== 3} />
            <Articy hidden={viewID !== 4} />
            <BuildDialog hidden={viewID !== 7} />
            {showModal && <ModalWindow closeModal={() => setShowModal(false)}
                onSaveAndContinue={handleSaveAndContinue}
                onContinueWithoutSaving={handleContinueWithoutSaving}
                upperTitle='Project should be saved before closing.' />}
            {isExternalWindowOpen && <ArticyOverlay />}
        </>
    )
}
