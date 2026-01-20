import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { CenteredSpinner } from '../Utils/CenteredSpinner'


export const Spoke = ({ hidden, isTutorial, onSpokeReady, returnToWelcomeScreen }) => {
    const defaultIframeSrc = 'https://localhost:9090'
    const tutorialIframeSrc = 'https://localhost:9090/projects/tutorial'
    const [spokeReady, setSpokeReady] = useState(false)
    const [iframeSrc, setIframeSrc] = useState('')  // initially empty
    const spokeIframe = useRef<HTMLIFrameElement | null>(null)


    const onSpokeProjectPageSelected = useCallback(() => {
        if(isTutorial) {
            setIframeSrc(tutorialIframeSrc)
        }
        setSpokeReady(true)
        onSpokeReady()
    }, [setSpokeReady, onSpokeReady, isTutorial])

    useEffect(() => {
        if(spokeReady && isTutorial) {
            // SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.exitTutorial, returnToWelcomeScreen)
            setIframeSrc(tutorialIframeSrc)
        } else if(spokeReady) {
            setIframeSrc(defaultIframeSrc)
        }
    }, [isTutorial, returnToWelcomeScreen, spokeReady])

    useEffect(() => {
        const handle = api.on(api.channels.fromMain.spokePortTaken, () => {
            setIframeSrc(defaultIframeSrc)
        })

        return () => {
            api.removeListener(api.channels.fromMain.spokePortTaken, handle)
        }
    }, [])

    useEffect(() => {
        const handle = api.on(api.channels.fromMain.projectUnloaded, () => {
            setSpokeReady(false)
            setIframeSrc(defaultIframeSrc)
            SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.navigateToProjectsPage)
        })

        return () => {
            api.removeListener(api.channels.fromMain.projectUnloaded, handle)
        }
    }, [])

    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        <SpokeIframe id={'iframe-spoke'} ref={el => {
            spokeIframe.current = el
            if(el) {
                SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.projectPageSelected, onSpokeProjectPageSelected)
                SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.exitTutorial, returnToWelcomeScreen)
            } else {
                SpokeAPI.Instance.clearAllEventListeners()
            }
        }} title={'Spoke Editor'} src={iframeSrc}
            style={{ display: spokeReady ? 'block' : 'none' }}
        />

        {!spokeReady && <CenteredSpinner />}
    </SpokeContainer>
}