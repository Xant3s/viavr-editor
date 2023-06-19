import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Label, Pane, Switch } from 'evergreen-ui'
import Typography from '@mui/material/Typography'
import { Slider } from '@mui/material'
import React, { useEffect, useState } from 'react'


export class Settings {
    percentValue = 50
    embedTextures = true
    embedBuffers = true
    noNormalMaps = false
    adjustExistingNormalMaps = false
    useVertexNormals = false
    creaseAngle = 70
    normalDeviation = 10
}

export const AdvancedSettings = ({setSettings}) => {
    const [percentValue, setPercentValue] = useState<number>(50)
    const [embedTextures, setEmbedTextures] = useState<boolean>(true)
    const [embedBuffers, setEmbedBuffers] = useState<boolean>(true)
    const [noNormalMaps, setNoNormalMaps] = useState<boolean>(false)
    const [adjustExistingNormalMaps, setAdjustExistingNormalMaps] = useState<boolean>(false)
    const [useVertexNormals, setUseVertexNormals] = useState<boolean>(false)
    const [creaseAngle, setCreaseAngle] = useState<number>(70)
    const [normalDeviation, setNormalDeviation] = useState<number>(10)


    useEffect(() => {
        setSettings({
            percentValue,
            embedTextures,
            embedBuffers,
            noNormalMaps,
            adjustExistingNormalMaps,
            useVertexNormals,
            creaseAngle,
            normalDeviation
        })
    }, [percentValue, embedTextures, embedBuffers, noNormalMaps, adjustExistingNormalMaps, useVertexNormals, creaseAngle, normalDeviation, setSettings])


    return <SettingAccordion summary={'Advanced Settings'} details={
        <div>
            <Pane maxWidth={200}>
                <Typography id='non-linear-slider' gutterBottom style={{ textAlign: 'left' }}>
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
                    valueLabelDisplay='auto'
                    aria-labelledby='non-linear-slider'
                />
            </Pane>
            <Label htmlFor='embedTexturesSwitch' marginBottom={8} display='flex' alignItems='left'
                   justifyContent='left' color='white'>
                <Switch
                    id='embedTexturesSwitch'
                    checked={embedTextures}
                    onChange={(e) => setEmbedTextures(e.target.checked)}
                    marginRight={8}
                />
                <span>Embed textures</span>
            </Label>
            <Label htmlFor='embedBuffersSwitch' marginBottom={8} display='flex' alignItems='left'
                   justifyContent='left' color='white'>
                <Switch
                    id='embedBuffersSwitch'
                    checked={embedBuffers}
                    onChange={(e) => setEmbedBuffers(e.target.checked)}
                    marginRight={8}
                />
                <span>Embed buffers</span>
            </Label>
            <Label htmlFor='noNormalMapsSwitch' marginBottom={8} display='flex' alignItems='left'
                   justifyContent='left' color='white'>
                <Switch
                    id='noNormalMapsSwitch'
                    checked={noNormalMaps}
                    onChange={(e) => setNoNormalMaps(e.target.checked)}
                    marginRight={8}
                />
                <span>Don&apos;t generate normal map</span>
            </Label>
            <Label htmlFor='adjustExistingNormalMapsSwitch' marginBottom={8} display='flex' alignItems='left'
                   justifyContent='left' color='white'>
                <Switch
                    id='adjustExistingNormalMapsSwitch'
                    checked={adjustExistingNormalMaps}
                    onChange={(e) => setAdjustExistingNormalMaps(e.target.checked)}
                    marginRight={8}
                />
                <span>Adjust existing normal maps</span>
            </Label>
            <Label htmlFor='useVertexNormalsSwitch' marginBottom={8} display='flex' alignItems='left'
                   justifyContent='left' color='white'>
                <Switch
                    id='useVertexNormalsSwitch'
                    checked={useVertexNormals}
                    onChange={(e) => setUseVertexNormals(e.target.checked)}
                    marginRight={8}
                />
                <span>Use vertex normals</span>
            </Label>
            <Pane maxWidth={200}>
                <Typography id='non-linear-slider' gutterBottom style={{ textAlign: 'left' }}>
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
                    valueLabelDisplay='auto'
                    aria-labelledby='non-linear-slider'
                />
            </Pane>
            <Pane maxWidth={200}>
                <Typography id='non-linear-slider' gutterBottom style={{ textAlign: 'left' }}>
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
                    valueLabelDisplay='auto'
                    aria-labelledby='non-linear-slider'
                />
            </Pane>
        </div>
    } />
}