import { Pane, Spinner, toaster } from 'evergreen-ui'
import React, { useState } from 'react'
import { Button } from '../../StyledComponents/Button'
import { FileDrop } from './FileDrop'
import { AdvancedSettings } from './AdvancedSettings'
import { AvatarEditorContainer } from '../AvatarEditor/Styles'
import { Settings } from '../../../@types/MeshPreprocessing'
import View3D from '@egjs/react-view3d'

import styles from './style.module.css'
import { Column, Row } from '../../StyledComponents/Row'


export const MeshPreprocessing = ({ hidden }) => {
    const [filePaths, setFilePaths] = useState<string[]>([])
    const [settings, setSettings] = useState(new Settings())
    const [isLoading, setIsLoading] = useState(false)
    const [hasPreview, setHasPreview] = useState(false)


    async function runPreprocessor(e) {
        e.preventDefault()
        if(filePaths.some(p => !p.endsWith('.gltf'))) {
            toaster.danger('Only .gltf files are supported')
            return
        }
        setHasPreview(false)
        setIsLoading(true)
        const status = await api.invoke(api.channels.toMain.runPreprocessor, filePaths, settings)
        if(status === 200) {
            toaster.success('Optimization successful')
            setHasPreview(true)
        } else {
            toaster.danger('Could not process this file')
        }
        setIsLoading(false)
    }

    return <AvatarEditorContainer hidden={hidden}>
        <h1>Optimize 3D Objects</h1>
        <Row>
            <form onSubmit={runPreprocessor} style={{ display: 'flex', flexDirection: 'row' }}>
                <Column style={{ alignItems: 'center', maxWidth: 654, margin: 10 }}>
                    <div>You can optimize one file at a time. You can only optimize .gltf file formats.
                        The optimized files will be named &apos;[original name]_optimized.glb&apos; and saved next to
                        the originals.
                    </div>
                    <Pane minWidth={500} maxWidth={654} marginTop={25}>
                        <FileDrop maxFiles={1} setFilePaths={setFilePaths} />
                    </Pane>
                </Column>
                <Column style={{ margin: 10, marginTop: 85 }}>
                    <Pane minWidth={500} maxWidth={654} marginBottom={25}>
                        <AdvancedSettings setSettings={setSettings} />
                    </Pane>
                    <Button type='submit' disabled={filePaths.length === 0 || isLoading}>Optimize</Button>
                </Column>
            </form>
            <Column style={{width: 500}}>
                <h2>Preview</h2>
                {isLoading ? (
                    <Column style={{ width: 500, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner size={64} />
                        <br />
                        <div>Loading...</div>
                    </Column>
                ) : (
                    hasPreview && (
                        <View3D tag='div' canvasClass={styles.canvas} src={filePaths[0].replace('.gltf', '_optimized.glb')} />
                    )
                )}
            </Column>
        </Row>
    </AvatarEditorContainer>
}