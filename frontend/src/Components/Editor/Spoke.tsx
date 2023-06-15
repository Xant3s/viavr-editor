import { SpokeContainer, SpokeIframe } from '../StyledComponents/Editor/StyledEditor'
import { useEffect, useState } from 'react'
import { Spinner } from 'evergreen-ui'
import SceneEditor from '../../SpokeEditor/SceneEditor'
import { SceneExport } from '../../SpokeEditor/SceneExport'
import SceneLoadingPage from '../../SpokeEditor/SceneLoadingPage'


export const Spoke = ({ hidden }) => {
    const [spokeReady, setSpokeReady] = useState(false)

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
        new SceneEditor()
        new SceneExport()
        new SceneLoadingPage()
    }, [spokeReady, hidden])

    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        {spokeReady ?
            <SpokeIframe id={'iframe-spoke'} title={'Spoke Editor'} src={'https://localhost:9090'} />
        :
            <CenteredSpinner />
        }
    </SpokeContainer>
}


const CenteredSpinner = () => {
    return <div style={{
        width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column',
    }}>
        <Spinner size={64} />
        <div style={{ fontSize: '24px', marginTop: '16px' }}>Loading...</div>
    </div>
}