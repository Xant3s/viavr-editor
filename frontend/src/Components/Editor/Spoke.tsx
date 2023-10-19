import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { CenteredSpinner } from '../Utils/CenteredSpinner'


export const Spoke = ({ hidden, isTutorial, onSpokeReady }) => {
    const [spokeReady, setSpokeReady] = useState(false)
    const spokeIframe = useRef<HTMLIFrameElement | null>(null)
    const iframeSrc = isTutorial ? 'https://localhost:9090/projects/tutorial' : 'https://localhost:9090';


    const onSpokeProjectPageSelected = useCallback(() => {
        console.log('onSpokeProjectPageSelected')
        setSpokeReady(true)
        onSpokeReady()
    }, [setSpokeReady, onSpokeReady]) 
    
    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        <SpokeIframe id={'iframe-spoke'} ref={el => {
            console.log('callback ref')
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