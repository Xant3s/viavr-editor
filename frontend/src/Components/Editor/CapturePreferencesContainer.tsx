import { CapturePreferecesContainerStyle } from '../StyledComponents/Editor/StyledEditor'
import { Button, TextInput, toaster, Combobox } from 'evergreen-ui'
import { PreferenceLabel } from '../StyledComponents/WelcomeScreen'
import { useEffect, useState } from 'react'
import { getTemplates } from '../RS/Communication'
import { getDataForAutoComplete } from '../RS/Communication'

export const CapturePreferencesContainer = ({setPage, setPreferences}) => {
    const [domainName, setDomainName] = useState('')
    const [themeName, setThemeName] = useState('')
    const [keyword, setKeyword] = useState('')
    const [username, setUsername] = useState('')
    const [specialisation, setSpecialisation] = useState('')

    const [domainList, setDomainList] = useState([])
    const [themeList, setThemeList] = useState([])
    
    useEffect(() => {
        const queryAutoCompleteData = async () => {
            const data = await getDataForAutoComplete()
            setDomainList(data?.domains ?? [])
            setThemeList(data?.themes ?? [])
        }
        queryAutoCompleteData()
    }, [])

    const updatePreferences = async event => {
        event.preventDefault()

        if(!domainName || !themeName || !keyword) {
            toaster.warning('Please fill all the fields')
            return
        }

        setPage('recommendation')

        const preferences = {
            user: {
                username: username,
                specialisation: specialisation
            },
            session: {
                t_domain: domainName,
                t_theme: themeName,
                t_keyword: keyword
            }
        }
        setPreferences(preferences)
    }

    return (
        <CapturePreferecesContainerStyle>
            <div
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
                <form onSubmit={updatePreferences}>
                    <PreferenceLabel htmlFor="username">Username</PreferenceLabel>
                    <TextInput placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    {' '}
                    <br />
                    <PreferenceLabel htmlFor="specialisation">Specialisation</PreferenceLabel>
                    <TextInput placeholder="Specialisation" onChange={e => setSpecialisation(e.target.value)} />
                    {' '}
                    <br />
                    <h3>What kind of project would you like to create?</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <PreferenceLabel htmlFor="domainName" style={{ marginRight: '10px', textAlign: 'right' }}>Domain</PreferenceLabel>
                        <Combobox
                            items={domainList}
                            onChange={selected => setDomainName(selected)}
                            placeholder="Domain Name (eg. Therapy)"
                            required
                        />
                    </div>
                    {/* <TextInput placeholder="Domain Name (eg. Therapy)" onChange={e => setDomainName(e.target.value)} required /> */}
                    {' '}
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <PreferenceLabel htmlFor="themeName" >Theme</PreferenceLabel>
                        <Combobox
                            items={themeList}
                            onChange={selected => setThemeName(selected)}
                            placeholder="Theme Name (eg. Speech)"
                            required
                        />
                    </div>
                    {/* <TextInput placeholder="Theme Name (eg. Speech" onChange={e => setThemeName(e.target.value)} required /> */}
                    {' '}
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <PreferenceLabel htmlFor="keyword">Keyword</PreferenceLabel>
                        <TextInput placeholder="Keyword" onChange={e => setKeyword(e.target.value)} required />
                    </div>
                    {' '}
                    <br />
                    <br />
                    <Button marginRight={16} appearance="primary" type="submit">Save</Button>
                </form>
                {' '}
                <br />
                <Button marginRight={16} appearance='primary' onClick={() => setPage('welcome')}>Back</Button>
            </div>
        </CapturePreferecesContainerStyle>
    )
}
