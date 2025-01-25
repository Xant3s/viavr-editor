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
import { useTranslation } from '../../../LocalizationContext'

export const MeshPreprocessing = ({ hidden }) => {
    const { translate, language, setLanguage } = useTranslation()

    const [filePaths, setFilePaths] = useState<string[]>([])
    const [settings, setSettings] = useState(new Settings())
    const [isLoading, setIsLoading] = useState(false)
    const [hasPreview, setHasPreview] = useState(false)

    async function runPreprocessor(e) {
        e.preventDefault()
        if (filePaths.some(p => !p.endsWith('.gltf'))) {
            toaster.danger(translate('error_only_gltf'))
            return
        }
        setHasPreview(false)
        setIsLoading(true)
        const status = await api.invoke(api.channels.toMain.runPreprocessor, filePaths, settings)
        if (status === 200) {
            toaster.success(translate('optimization_successful'))
            setHasPreview(true)
        } else {
            toaster.danger(translate('error_could_not_process'))
        }
        setIsLoading(false)
    }

    return (
        <AvatarEditorContainer hidden={hidden}>
            <h1>{translate('optimize_3d_objects')}</h1>
            <Row>
                <form onSubmit={runPreprocessor} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Column style={{ alignItems: 'center', maxWidth: 654, margin: 10 }}>
                        <div>{translate('optimization_description')}</div>
                        <Pane minWidth={500} maxWidth={654} marginTop={25}>
                            <FileDrop maxFiles={1} setFilePaths={setFilePaths} />
                        </Pane>
                    </Column>
                    <Column style={{ margin: 10, marginTop: 85 }}>
                        <Pane minWidth={500} maxWidth={654} marginBottom={25}>
                            <AdvancedSettings setSettings={setSettings} />
                        </Pane>
                        <Button type='submit' disabled={filePaths.length === 0 || isLoading}>{translate('optimize')}</Button>
                    </Column>
                </form>
                <Column style={{ width: 500 }}>
                    <h2>{translate('preview')}</h2>
                    {isLoading ? (
                        <Column style={{ width: 500, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                            <Spinner size={64} />
                            <br />
                            <div>{translate('loading')}</div>
                        </Column>
                    ) : (
                        hasPreview && filePaths.length > 0 && (
                            <View3D tag='div' canvasClass={styles.canvas} src={filePaths[0].replace('.gltf', '_optimized.glb')} />
                        )
                    )}
                </Column>
            </Row>
        </AvatarEditorContainer>
    )
}
