import { useState } from 'react'
import { Button } from '../StyledComponents/Button'
import { Alert, TextInput, toaster } from 'evergreen-ui'
import { Center, SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'

export const Share = ({ hidden }) => {
    const [projectName, setProjectName] = useState('')

    const handleNameChange = event => {
        setProjectName(event.target.value)
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if (projectName) {
            console.log(projectName)
            const status = await api.invoke(api.channels.toMain.shareProject, projectName)
            if (status === 200) {
                toaster.success('Upload successful.', { duration: 5 })
            } else if (status === 503) {
                toaster.danger('Server unavailable or wrong address specified in preferences.', { duration: 5 })
            } else {
                toaster.danger('Something went wrong.', { duration: 5 })
            }
        }
    }

    return (
        <div
            hidden={hidden}
            style={{
                backgroundColor: '#3a4048',
                height: 'calc(100vh - 76px)',
                margin: 0,
                padding: 10,
                textAlign: 'center',
                color: 'white',
            }}
        >
            <h1>Share Your Project</h1>
            <Center>
                <Alert intent="warning">Experimental feature. This is not yet finished and might not be in the final version.</Alert>
                <Alert intent="info">Requires a template server to run. The server URL has to be specified in File {'>'} Preferences {'>'} Template Server URL.</Alert>
            </Center>
            <form onSubmit={handleSubmit}>
                <SettingEntryLabel htmlFor="projectName">Project Name</SettingEntryLabel>
                <TextInput placeholder="Project Name" onChange={handleNameChange} required />
                <Button type="submit">Upload</Button>
            </form>
        </div>
    )
}
