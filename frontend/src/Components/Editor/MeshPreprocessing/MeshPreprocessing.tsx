import { Pane, toaster } from 'evergreen-ui'
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


    async function runPreprocessor(e) {
        e.preventDefault()
        if(filePaths.some(p => !p.endsWith('.gltf'))) {
            toaster.danger('Only .gltf files are supported')
            return
        }
        const status = await api.invoke(api.channels.toMain.runPreprocessor, filePaths, settings)
        if(status === 200) {
            toaster.success('Optimization successful')
            // handleRemove(files[0])
        } else {
            toaster.danger('Could not process this file')
            // handleRemove(files[0])
        }
    }

    return <AvatarEditorContainer hidden={hidden}>
        <h1>Optimize 3D Objects</h1>
        <Row>
            <form onSubmit={runPreprocessor} style={{display: 'flex', flexDirection: 'row'}}>
                <Column style={{alignItems: 'center', maxWidth: 654, margin: 10}}>
                    <div>You can optimize one file at a time. You can only optimize .gltf file formats.
                        The optimized files will be named &apos;[original name]_optimized.glb&apos; and saved next to the originals.</div>
                    <Pane minWidth={500} maxWidth={654} marginTop={25}>
                        <FileDrop maxFiles={1} setFilePaths={setFilePaths} />
                    </Pane>
                </Column>
                <Column style={{margin: 10, marginTop: 85}}>
                    <Pane minWidth={500} maxWidth={654} marginBottom={25}>
                        <AdvancedSettings setSettings={setSettings} />
                    </Pane>
                    {/*TODO: add spinner while processing*/}
                    <Button type='submit' disabled={filePaths.length === 0}>Optimize</Button>
                </Column>
            </form>
            <Column>
                <h2>Preview</h2>
                <View3D
                    tag="div"
                    canvasClass={styles.canvas}
                    src={'Duck.glb'}
                    onReady={e => {
                        console.log(e)
                    }}
                    onError={e => {
                        console.log('error', e)
                    }}
                />
            </Column>
        </Row>
    </AvatarEditorContainer>
}