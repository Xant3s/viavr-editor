import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { CenteredSpinner } from '../Utils/CenteredSpinner'


export const Spoke = ({ hidden, isTutorial, onSpokeReady }) => {
    const defaultIframeSrc = 'https://localhost:9090'
    const tutorialIframeSrc = 'https://localhost:9090/projects/tutorial'
    const [spokeReady, setSpokeReady] = useState(false)
    const [iframeSrc, setIframeSrc] = useState(defaultIframeSrc)
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
            setIframeSrc(tutorialIframeSrc)
        }
    }, [isTutorial, spokeReady])
    
    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        <SpokeIframe id={'iframe-spoke'} ref={el => {
            spokeIframe.current = el
            if(el) {
                SpokeAPI.Instance.SpokeWindow = spokeIframe.current?.contentWindow as Window
                SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.projectPageSelected, onSpokeProjectPageSelected)

            } else {
                SpokeAPI.Instance.clearAllEventListeners()
                SpokeAPI.Instance.SpokeWindow = undefined
            }
        }} title={'Spoke Editor'} src={iframeSrc}
            style={{ display: spokeReady ? 'block' : 'none' }} 
        />

        {!spokeReady && <CenteredSpinner />}
    </SpokeContainer>
}