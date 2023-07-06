import { Button } from 'evergreen-ui'
import { useEffect, useState } from 'react'

export const Articy = ({ hidden }) => {

    const [isDisabled, setDisabled] = useState(false);

    useEffect(() => {
        api.on(api.channels.fromMain.externalWindowOpened, () => setDisabled(true))
        api.on(api.channels.fromMain.externalWindowClosed, () => setDisabled(false))
    }, [])

    const openArticyEditor = () => {
        api.invoke(api.channels.toMain.openArticyEditor)
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
        <Button disabled={isDisabled} appearance='primary' onClick={() => openArticyEditor()}>Open Articy Editor</Button>
    </div>
}
