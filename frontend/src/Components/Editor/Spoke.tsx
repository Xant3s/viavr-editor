import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useEffect, useRef, useState } from 'react'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { CenteredSpinner } from '../Utils/CenteredSpinner'


export const Spoke = ({ hidden, isTutorial, onSpokeReady }) => {
    const [spokeReady, setSpokeReady] = useState(false)
    const spokeIframe = useRef<HTMLIFrameElement>(null)
    const iframeSrc = isTutorial ? 'https://localhost:9090/projects/tutorial' : 'https://localhost:9090';
    

    useEffect(() => {
        let timeout: NodeJS.Timeout
        
        const checkSpokeReady = async () => {
            if(spokeReady) return
            try{
                const response = await fetch('https://localhost:9090')
                if(response.ok) {
                    if(spokeIframe.current !== null) {
                        SpokeAPI.Instance.SpokeWindow = spokeIframe.current.contentWindow as Window
                    }
                    setSpokeReady(true)
                    setTimeout(onSpokeReady, 100)
                } else {
                    timeout = setTimeout(checkSpokeReady, 1000)
                }
            } catch(e) {
                console.log(e)
                timeout = setTimeout(checkSpokeReady, 1000)
            } 
        }

        checkSpokeReady()
        return () => clearTimeout(timeout)
    }, [spokeReady, onSpokeReady])


    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        {spokeReady ?
            <SpokeIframe id={'iframe-spoke'} ref={spokeIframe} title={'Spoke Editor'} src={iframeSrc} />
        :
            <CenteredSpinner />
        }
    </SpokeContainer>
}