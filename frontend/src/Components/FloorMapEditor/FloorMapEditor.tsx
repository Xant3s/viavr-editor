import { FC, useEffect, useState } from 'react'
import { Button } from '../StyledComponents/Button'
import { DrawioEditor } from './DrawioEditor'
import { TriggerEditor } from './TriggerEditor'

export const FloorMapEditor: FC = () => {
    const [tabId, setTabId] = useState(0)
    const [floorMapAvailable, setFloorMapAvailable] = useState(false)


    const getTab = (id: number) => {
        switch(id) {
            case 0:
                return <DrawioEditor onFloorMapAvailable={() => setFloorMapAvailable(true)} />
            case 1:
                return <TriggerEditor />
        }
    }

    useEffect(() => {
        const loadFloorMap = async () => {
            const floorMap = await api.invoke(api.channels.toMain.floorMapLoadSvg)
            if(floorMap !== undefined) {
                setFloorMapAvailable(true)
            }
        }
        loadFloorMap()
    }, [])

    return <>
        <Header setId={setTabId} floorMapAvailable={floorMapAvailable}></Header>
        {getTab(tabId)}
    </>
}

export const Header = ({ setId, floorMapAvailable }) => {
    return <div style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
        <div style={{ padding: 5, display: 'inline-block' }}>
            <Button onClick={() => setId(0)}>Step 1: Draw Floor Map</Button>
            <Button onClick={() => setId(1)} disabled={!floorMapAvailable}>Step 2: Define Triggers</Button>
        </div>
    </div>
}