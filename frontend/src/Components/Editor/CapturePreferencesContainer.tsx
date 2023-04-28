import { CapturePreferecesContainerStyle } from "../StyledComponents/Editor/StyledEditor";
import { Button, TextInput } from "evergreen-ui";
import { Row } from "../StyledComponents/Row";
import { PreferenceLabel } from '../StyledComponents/WelcomeScreen'

const CapturePreferencesContainer = ({
    hidden, 
    setWelcomeContainer, 
    setCapturePreferencesContainer, 
    setTemplateRecommendationContainer,
    sendDataToServer,
    handleUsernameChange,
    handleSpecialisationChange,
    handleDomainChange,
    handleThemeChange,
    handleKeywordChange}) => {
    return (
        <CapturePreferecesContainerStyle hidden={hidden}>
            <div
            hidden={hidden}
            style={{
                backgroundColor: '#15171b',
                position: 'relative',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 10,
                color: 'white',
                textAlign: 'center',
                alignItems: 'center',
              }}
        >
            <h2>Preferences</h2>
            <h3>Please enter your details:</h3>
            <form onSubmit={sendDataToServer}>
                <PreferenceLabel htmlFor="username">Username</PreferenceLabel>
                <TextInput placeholder="Username" onChange={handleUsernameChange} /> <br />
                <PreferenceLabel htmlFor="specialisation">Specialisation</PreferenceLabel>
                <TextInput placeholder="Specialisation" onChange={handleSpecialisationChange} />  <br />
                <h3>What kind of project would you like to create?</h3>
                <PreferenceLabel htmlFor="domainName">Domain</PreferenceLabel>
                <TextInput placeholder="Domain Name (eg. Rehab)" onChange={handleDomainChange} required /> <br />
                <PreferenceLabel htmlFor="themeName">Theme</PreferenceLabel>
                <TextInput placeholder="Theme Name (eg. Speech)" onChange={handleThemeChange} required /> <br />
                <PreferenceLabel htmlFor="keyword">Keyword</PreferenceLabel>
                <TextInput placeholder="Keyword" onChange={handleKeywordChange} required /> <br /> <br />
                <Button marginRight={16} appearance="primary" type="submit">Save</Button>
            </form> <br />
            <Button marginRight={16} appearance="primary" onClick={() => {
                setWelcomeContainer(hidden)
                setCapturePreferencesContainer(!hidden)
                setTemplateRecommendationContainer(!hidden)
            }}>
                Back
            </Button>

        </div>
        </CapturePreferecesContainerStyle>
    )}

export default CapturePreferencesContainer;