import styled from 'styled-components'

export const SpokeContainer = styled.div`
  width: 100%;
  height: calc(100% - 38px);
  position: absolute;
  left: 0;
  overflow: hidden;
`

export const SpokeIframe = styled.iframe`
  width: 100%;
  height: 100vh;
  border: 0;
`

export const WelcomeContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #15171b;
  height: ${props => props.hidden ? 0 : '100vh'};
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`

export const CapturePreferecesContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #15171b;
  height: ${props => props.hidden ? 0 : '100vh'};
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`

export const TemplateRecommendationContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #15171b;
  height: ${props => props.hidden ? 0 : '100vh'};
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`