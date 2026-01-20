import { FC, useEffect, useState } from 'react'
import { Button } from '../StyledComponents/Button'
import { DrawioEditor } from './DrawioEditor'
import { TriggerEditor } from './TriggerEditor'
import { ModalWindow } from '../Utils/UI'

export const FloorMapEditor: FC = () => {
    const [tabId, setTabId] = useState(0)
    const [floorMapAvailable, setFloorMapAvailable] = useState(false)
    const [drawioOpen, setDrawioOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)


    const getTab = (id: number) => {
        switch (id) {
            case 0:
                return <DrawioEditor onFloorMapAvailable={() => setFloorMapAvailable(true)} onDrawioStateChange={setDrawioOpen} />
            case 1:
                return <TriggerEditor />
        }
    }

    const onCloseConfirmed = async () => {
        await api.invoke(api.channels.toMain.floorMapEditorConfirmClose)
    }

    useEffect(() => {
        const loadFloorMap = async () => {
            const floorMap = await api.invoke(api.channels.toMain.floorMapLoadSvg)
            if (floorMap !== undefined) {
                setFloorMapAvailable(true)
            }
        }
        loadFloorMap()

        const onTryClose = () => {
            if (drawioOpen) {
                setShowModal(true)
            } else {
                api.invoke(api.channels.toMain.floorMapEditorConfirmClose)
            }
        }

        const id = api.on(api.channels.fromMain.floorMapEditorTryClose, onTryClose)
        return () => {
            api.removeListener(api.channels.fromMain.floorMapEditorTryClose, id)
        }
    }, [drawioOpen])

    return <>
        <Header setId={setTabId} floorMapAvailable={floorMapAvailable}></Header>
        {getTab(tabId)}
        {showModal && <ModalWindow closeModal={() => setShowModal(false)}
            onSaveAndContinue={onCloseConfirmed}
            onContinueWithoutSaving={onCloseConfirmed}
            upperTitle='You have unsaved changes in the Floor Map Editor.'
            lowerTitle='Do you really want to close the window? Unsaved changes will be lost.'
            buttonText='Close' />}
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