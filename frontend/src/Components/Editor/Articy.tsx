import { Button } from 'evergreen-ui'

export const Articy = ({ hidden }) => {
    const openArticyEditor = () => {
        api.send(api.channels.toMain.openArticyEditor)
    }

    return <div hidden={hidden} style={{
        backgroundColor: '#3a4048',
        height: 'calc(100vh - 76px)',
        margin: 0,
        padding: 10,
        textAlign: 'center',
        color: 'white',
    }}>
        <h1>Articy</h1>
        <Button appearance='primary' onClick={() => openArticyEditor()}>Open Articy Editor</Button>
    </div>
}
