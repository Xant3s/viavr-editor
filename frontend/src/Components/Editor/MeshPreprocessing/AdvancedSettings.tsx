import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Label, Switch } from 'evergreen-ui'
import Typography from '@mui/material/Typography'
import { Slider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip } from 'react-tooltip'
import { useTranslation } from '../../../LocalizationContext'

export const AdvancedSettings = ({ setSettings }) => {
    const { translate, language, setLanguage } = useTranslation()

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

    return (
        <SettingAccordion
            summary={translate('advanced_settings_title')}
            details={
                <div>
                    <SliderSetting id='percentSlider' value={percentValue} setter={setPercentValue} text={translate('target_percentage')} min={1} max={100}
                                   tooltip={translate('target_percentage_tooltip')} />
                    <SwitchSetting id='embedTexturesSwitch' checked={embedTextures} setter={setEmbedTextures} text={translate('embed_textures')}
                                   tooltip={translate('embed_textures_tooltip')} />
                    <SwitchSetting id='embedBuffersSwitch' checked={embedBuffers} setter={setEmbedBuffers} text={translate('embed_buffers')}
                                   tooltip={translate('embed_buffers_tooltip')} />
                    <SwitchSetting id='noNormalMapsSwitch' checked={noNormalMaps} setter={setNoNormalMaps} text={translate('no_normal_maps')}
                                   tooltip={translate('no_normal_maps_tooltip')} />
                    <SwitchSetting id='adjustExistingNormalMapsSwitch' checked={adjustExistingNormalMaps} setter={setAdjustExistingNormalMaps} text={translate('adjust_existing_normal_maps')}
                                   tooltip={translate('adjust_existing_normal_maps_tooltip')} />
                    <SwitchSetting id='useVertexNormalsSwitch' checked={useVertexNormals} setter={setUseVertexNormals} text={translate('use_vertex_normals')}
                                   tooltip={translate('use_vertex_normals_tooltip')} />
                    <SliderSetting id='creaseAngleSlider' value={creaseAngle} setter={setCreaseAngle} text={translate('crease_angle')} min={1} max={150}
                                   tooltip={translate('crease_angle_tooltip')} />
                    <SliderSetting id='normalDeviationSlider' value={normalDeviation} setter={setNormalDeviation} text={translate('normal_deviation')} min={1} max={100}
                                   tooltip={translate('normal_deviation_tooltip')} />
                </div>
            }
        />
    )
}

const SwitchSetting = ({ id, checked, setter, text, tooltip }) => {
    return (
        <Label htmlFor={id} marginBottom={8} display='flex' alignItems='left' justifyContent='left' color='white'>
            <Switch
                id={id}
                checked={checked}
                onChange={(e) => setter(e.target.checked)}
                marginRight={8}
            />
            <span>{text}</span>
            <div>
                <HelpOutlineIcon data-tooltip-id={`${id}-tooltip`} data-tooltip-html={tooltip} data-tooltip-place="right"
                                 style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }} />
            </div>
            <Tooltip id={`${id}-tooltip`} />
        </Label>
    )
}

const SliderSetting = ({ id, value, setter, text, min, max, tooltip }) => {
    return (
        <div>
            <Typography id={id} gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
                {text}: {value.toString()}
                <HelpOutlineIcon data-tooltip-id={`${id}-tooltip`} data-tooltip-html={tooltip} data-tooltip-place="right"
                                 style={{ color: '#006EFF', fontSize: 16, marginLeft: 10 }} />
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
    )
}