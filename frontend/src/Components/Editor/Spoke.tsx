import {SpokeContainer, SpokeIframe} from '../StyledComponents/Editor/StyledEditor'

export const Spoke = ({hidden}) => {
    return <SpokeContainer id={'spoke-container'} hidden={hidden}>
        <SpokeIframe id={'iframe-spoke'} title={'Spoke Editor'} src={'https://localhost:9090'}/>
    </SpokeContainer>
}
