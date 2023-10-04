import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Label, Pane, Switch } from 'evergreen-ui'
import Typography from '@mui/material/Typography'
import { Slider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Tooltip} from 'react-tooltip'


export const AdvancedSettings = ({setSettings}) => {
    const [percentValue, setPercentValue] = useState<number>(50)
    const [embedTextures, setEmbedTextures] = useState<boolean>(true)
    const [embedBuffers, setEmbedBuffers] = useState<boolean>(true)
    const [noNormalMaps, setNoNormalMaps] = useState<boolean>(false)
    const [adjustExistingNormalMaps, setAdjustExistingNormalMaps] = useState<boolean>(false)
    const [useVertexNormals, setUseVertexNormals] = useState<boolean>(false)
    const [creaseAngle, setCreaseAngle] = useState<number>(70)
    const [normalDeviation, setNormalDeviation] = useState<number>(5)


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
            <SliderSetting id='percentSlider' value={percentValue} setter={setPercentValue} text='Target percentage' min={1} max={100}
                            tooltip={'This value specifies by how many percent the individual sub-meshes are to be reduced.'}/>
            <SwitchSetting id='embedTexturesSwitch' checked={embedTextures} setter={setEmbedTextures} text='Embed textures'
                            tooltip={'If this setting is used, the textures are saved with the output.gltf file <br /> and no extra image is created. ATTENTION: This leads to a considerably larger GLTF file.'}/>
            <SwitchSetting id='embedBuffersSwitch' checked={embedBuffers} setter={setEmbedBuffers} text='Embed buffers'
                            tooltip={'If this setting is used, the buffers are also saved in the output.gltf file. <br />ATTENTION! This leads to a considerably larger GLTF file.'}/>
            <SwitchSetting id='noNormalMapsSwitch' checked={noNormalMaps} setter={setNoNormalMaps} text='Don&apos;t generate normal map'
                            tooltip={'The triangle mesh is simplified, but no details are stored in a normal map.<br />Shortens the calculation time.'}/>
            <SwitchSetting id='adjustExistingNormalMapsSwitch' checked={adjustExistingNormalMaps} setter={setAdjustExistingNormalMaps} text='Adjust existing normal maps'
                            tooltip={'By default, normal maps are only calculated for meshes for which no normal map exists.<br />With these settings, these normal maps are also adjusted again.'}/>
            <SwitchSetting id='useVertexNormalsSwitch' checked={useVertexNormals} setter={setUseVertexNormals} text='Use vertex normals'
                            tooltip={'This setting results in a faster calculation, but can lead to more artefacts.'}/>
            <SliderSetting id='creaseAngleSlider' value={creaseAngle} setter={setCreaseAngle} text='Crease angle' min={1} max={150}
                            tooltip={'The "crease_angle" is used to specify when edges are defined as creases. <br />If sharp edges are contained in the model, too large an angle can lead to <br />artifacts. To eliminate these, a smaller angle should be selected here.'}/>
            <SliderSetting id='normalDeviationSlider' value={normalDeviation} setter={setNormalDeviation} text='Normal deviation' min={1} max={100}
                            tooltip={'This setting specifies how much the result may deviate from the input mesh.<br />A higher value leads to greater errors, too small a value prevents simplification. <br />Normally, this value should be between 5 and 15 degrees.'}/>
        </div>
    } />
}

const SwitchSetting = ({id, checked, setter, text, tooltip}) => {
    return <Label htmlFor={id} marginBottom={8} display='flex' alignItems='left'
           justifyContent='left' color='white'>
        <Switch
            id={id}
            checked={checked}
            onChange={(e) => setter(e.target.checked)}
            marginRight={8}
        />
        <span >{text}</span>
        <div>
            <HelpOutlineIcon data-tooltip-id="my-tooltip" data-tooltip-html={tooltip} data-tooltip-place="right" style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }}/>
        </div>
        <Tooltip id="my-tooltip"/>


    </Label>
}

const SliderSetting = ({id, value, setter, text, min, max, tooltip}) => {
    return     <div>
    <Typography id={id} gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
        {text}: {value.toString()}
      <HelpOutlineIcon
        data-tooltip-id={`${id}-tooltip`}
        data-tooltip-html={tooltip}
        data-tooltip-place="right"
        style={{ color: '#006EFF', fontSize: 16, marginLeft: 10 }}
      />
    </Typography>
    <div style={{ width: 200 }}>
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
    </div>
    <Tooltip id={`${id}-tooltip`} />
  </div>
}