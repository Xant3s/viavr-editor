import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Label, Pane, Switch } from 'evergreen-ui'
import Typography from '@mui/material/Typography'
import { Slider } from '@mui/material'
import React, { useEffect, useState } from 'react'


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
            <SliderSetting id='percentSlider' value={percentValue} setter={setPercentValue} text='Target percentage' min={1} max={100} />
            <SwitchSetting id='embedTexturesSwitch' checked={embedTextures} setter={setEmbedTextures} text='Embed textures' />
            <SwitchSetting id='embedBuffersSwitch' checked={embedBuffers} setter={setEmbedBuffers} text='Embed buffers' />
            <SwitchSetting id='noNormalMapsSwitch' checked={noNormalMaps} setter={setNoNormalMaps} text='Don&apos;t generate normal map' />
            <SwitchSetting id='adjustExistingNormalMapsSwitch' checked={adjustExistingNormalMaps} setter={setAdjustExistingNormalMaps} text='Adjust existing normal maps' />
            <SwitchSetting id='useVertexNormalsSwitch' checked={useVertexNormals} setter={setUseVertexNormals} text='Use vertex normals' />
            <SliderSetting id='creaseAngleSlider' value={creaseAngle} setter={setCreaseAngle} text='Crease angle' min={1} max={150} />
            <SliderSetting id='normalDeviationSlider' value={normalDeviation} setter={setNormalDeviation} text='Normal deviation' min={1} max={100} />
        </div>
    } />
}

const SwitchSetting = ({id, checked, setter, text}) => {
    return <Label htmlFor={id} marginBottom={8} display='flex' alignItems='left'
           justifyContent='left' color='white'>
        <Switch
            id={id}
            checked={checked}
            onChange={(e) => setter(e.target.checked)}
            marginRight={8}
        />
        <span>{text}</span>
    </Label>
}

const SliderSetting = ({id, value, setter, text, min, max}) => {
    return <Pane maxWidth={200}>
        <Typography id={id} gutterBottom style={{ textAlign: 'left' }}>
            {text}: {value.toString()}
        </Typography>
        <Slider
            value={value}
            min={min}
            step={1}
            max={max}
            getAriaValueText={() => value.toString()}
            valueLabelFormat={() => value.toString()}
            onChange={(e, newValue) => setter(newValue as number)}
            valueLabelDisplay='auto'
            aria-labelledby='non-linear-slider'
        />
    </Pane>
}