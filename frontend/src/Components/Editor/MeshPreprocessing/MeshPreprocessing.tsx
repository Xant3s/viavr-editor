import { Label, Pane, Switch, toaster } from 'evergreen-ui'
import React, { useState } from 'react'
import { Button } from '../../StyledComponents/Button'
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Slider } from '@mui/material'
import Typography from '@mui/material/Typography'
import { FileDrop } from './FileDrop'


export const MeshPreprocessing = ({ hidden }) => {
    const [filePaths, setFilePaths] = useState<string[]>([])

    const [percentValue, setPercentValue] = useState<number>(50)
    const [embedTextures, setEmbedTextures] = useState<boolean>(true)
    const [embedBuffers, setEmbedBuffers] = useState<boolean>(true)
    const [noNormalMaps, setNoNormalMaps] = useState<boolean>(false)
    const [adjustExistingNormalMaps, setAdjustExistingNormalMaps] = useState<boolean>(false)
    const [useVertexNormals, setUseVertexNormals] = useState<boolean>(false)
    const [creaseAngle, setCreaseAngle] = useState<number>(70)
    const [normalDeviation, setNormalDeviation] = useState<number>(10)


    async function runPreprocessor(e) {
        e.preventDefault()
        if(filePaths.some(p => !p.endsWith('.gltf'))) {
            toaster.danger('Only .gltf files are supported')
            return
        }
        const status = await api.invoke(api.channels.toMain.runPreprocessor, filePaths, percentValue, embedTextures, embedBuffers)
        if(status === 200) {
            toaster.success('Optimization successful')
            // handleRemove(files[0])
        } else {
            toaster.danger('Could not process this file')
            // handleRemove(files[0])
        }
    }

    return <div
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
        <h1>Optimize 3D Objects</h1>
        <form onSubmit={runPreprocessor} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>You can optimize one file at a time. You can only optimize .gltf file formats.
                The optimized files will be named &apos;[original name]_optimized.gltf&apos; and saved next to the originals.</div>
            <Pane minWidth={500} maxWidth={654} marginTop={25}>
                <FileDrop maxFiles={1} setFilePaths={setFilePaths} />
            </Pane>

            <Pane minWidth={500} maxWidth={654} marginBottom={25}>
                <SettingAccordion summary={'Advanced Settings'}  details={
                    <div>
                        <Pane maxWidth={200}>
                            <Typography id="non-linear-slider" gutterBottom style={{textAlign: 'left'}}>
                                Target Percentage: {percentValue.toString()}
                            </Typography>
                            <Slider
                                value={percentValue}
                                min={1}
                                step={1}
                                max={100}
                                getAriaValueText={() => percentValue.toString()}
                                valueLabelFormat={() => percentValue.toString()}
                                onChange={(e, newValue) => setPercentValue(newValue as number)}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </Pane>
                        <Label htmlFor="embedTexturesSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                            <Switch
                                id="embedTexturesSwitch"
                                checked={embedTextures}
                                onChange={(e) => setEmbedTextures(e.target.checked)}
                                marginRight={8}
                            />
                            <span>Embed textures</span>
                        </Label>
                        <Label htmlFor="embedBuffersSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                            <Switch
                                id="embedBuffersSwitch"
                                checked={embedBuffers}
                                onChange={(e) => setEmbedBuffers(e.target.checked)}
                                marginRight={8}
                            />
                            <span>Embed buffers</span>
                        </Label>
                        <Label htmlFor="noNormalMapsSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                            <Switch
                                id="noNormalMapsSwitch"
                                checked={noNormalMaps}
                                onChange={(e) => setNoNormalMaps(e.target.checked)}
                                marginRight={8}
                            />
                            <span>Don&apos;t generate normal map</span>
                        </Label>
                        <Label htmlFor="adjustExistingNormalMapsSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                            <Switch
                                id="adjustExistingNormalMapsSwitch"
                                checked={adjustExistingNormalMaps}
                                onChange={(e) => setAdjustExistingNormalMaps(e.target.checked)}
                                marginRight={8}
                            />
                            <span>Adjust existing normal maps</span>
                        </Label>
                        <Label htmlFor="useVertexNormalsSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                            <Switch
                                id="useVertexNormalsSwitch"
                                checked={useVertexNormals}
                                onChange={(e) => setUseVertexNormals(e.target.checked)}
                                marginRight={8}
                            />
                            <span>Use vertex normals</span>
                        </Label>
                        <Pane maxWidth={200}>
                            <Typography id="non-linear-slider" gutterBottom style={{textAlign: 'left'}}>
                                Crease angle: {creaseAngle.toString()}
                            </Typography>
                            <Slider
                                value={creaseAngle}
                                min={1}
                                step={1}
                                max={150}
                                getAriaValueText={() => creaseAngle.toString()}
                                valueLabelFormat={() => creaseAngle.toString()}
                                onChange={(e, newValue) => setCreaseAngle(newValue as number)}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </Pane>
                        <Pane maxWidth={200}>
                            <Typography id="non-linear-slider" gutterBottom style={{textAlign: 'left'}}>
                                Normal deviation: {normalDeviation.toString()}
                            </Typography>
                            <Slider
                                value={normalDeviation}
                                min={1}
                                step={1}
                                max={100}
                                getAriaValueText={() => normalDeviation.toString()}
                                valueLabelFormat={() => normalDeviation.toString()}
                                onChange={(e, newValue) => setNormalDeviation(newValue as number)}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </Pane>
                    </div>
                } />
            </Pane>
            <Button type='submit' disabled={filePaths.length === 0}>Optimize</Button>
        </form>
    </div>
}