import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useEffect, useRef, useState } from 'react'
import { SceneExport } from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'
import { CenteredSpinner } from '../Utils/CenteredSpinner'


export const Spoke = ({ hidden }) => {
    const [spokeReady, setSpokeReady] = useState(false)
    const spokeIframe = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const checkSpokeReady = async () => {
            const url = 'https://localhost:9090'
            const response = await fetch(url)
            if(response.ok) {
                setSpokeReady(true)
            } else {
                setTimeout(checkSpokeReady, 100)
            }
        }
        checkSpokeReady()
    }, [])

    useEffect(() => {
        if(!spokeReady || hidden) return
        if(spokeIframe.current !== null) {
            SpokeAPI.Instance.SpokeWindow = spokeIframe.current.contentWindow as Window
        }
        new SceneExport()
        new SceneLoadingPage()
    }, [spokeReady, hidden])

    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        {spokeReady ?
            <SpokeIframe id={'iframe-spoke'} ref={spokeIframe} title={'Spoke Editor'} src={'https://localhost:9090'} />
        :
            <CenteredSpinner />
        }
    </SpokeContainer>
}