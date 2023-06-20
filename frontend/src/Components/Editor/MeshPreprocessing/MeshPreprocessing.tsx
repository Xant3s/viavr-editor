import { Pane, toaster } from 'evergreen-ui'
import React, { useState } from 'react'
import { Button } from '../../StyledComponents/Button'
import { FileDrop } from './FileDrop'
import { AdvancedSettings } from './AdvancedSettings'
import { AvatarEditorContainer } from '../AvatarEditor/Styles'
import { Settings } from '../../../@types/MeshPreprocessing'


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

    return <AvatarEditorContainer>
        <h1>Optimize 3D Objects</h1>
        <form onSubmit={runPreprocessor} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>You can optimize one file at a time. You can only optimize .gltf file formats.
                The optimized files will be named &apos;[original name]_optimized.gltf&apos; and saved next to the originals.</div>
            <Pane minWidth={500} maxWidth={654} marginTop={25}>
                <FileDrop maxFiles={1} setFilePaths={setFilePaths} />
            </Pane>
            <Pane minWidth={500} maxWidth={654} marginBottom={25}>
                <AdvancedSettings setSettings={setSettings} />
            </Pane>
            <Button type='submit' disabled={filePaths.length === 0}>Optimize</Button>
        </form>
    </AvatarEditorContainer>
}