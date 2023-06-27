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
            <SliderSetting id='percentSlider' value={percentValue} setter={setPercentValue} text='Target percentage' min={1} max={100}
                            tooltip={'Dieser Wert gibt an, um wieviel Prozent die einzelnen Teilmeshes reduziert werden sollen.'}/>
            <SwitchSetting id='embedTexturesSwitch' checked={embedTextures} setter={setEmbedTextures} text='Embed textures'
                            tooltip={'Wird diese Einstellung genutzt, werden die Texturen mit in der Output.gltf-Datei gespeichert \n' +
                                'und es wird kein extra Bild erzeugt. ACHTUNG! Dies führt zu einer erheblich größeren GLTF-Datei.\n'}/>
            <SwitchSetting id='embedBuffersSwitch' checked={embedBuffers} setter={setEmbedBuffers} text='Embed buffers'
                            tooltip={'Wird diese Einstellung genutzt, werden die Buffer mit in der Output.gltf-Datei gespeichert. \n' +
                                'ACHTUNG! Dies führt zu einer erheblich größeren GLTF-Datei.\n'}/>
            <SwitchSetting id='noNormalMapsSwitch' checked={noNormalMaps} setter={setNoNormalMaps} text='Don&apos;t generate normal map'
                            tooltip={'Das Dreiecksnetz wird vereinfacht, aber es werden keine Details in einer Normal Map gespeichert.\n' +
                                'Verkürzt die Berechnungszeit.\n'}/>
            <SwitchSetting id='adjustExistingNormalMapsSwitch' checked={adjustExistingNormalMaps} setter={setAdjustExistingNormalMaps} text='Adjust existing normal maps'
                            tooltip={'Standardmäßig werden Normal Maps nur für Meshes berechnet, für die noch keine Normal Map existiert.\n' +
                                'Mit dieser Einstellungen werden auch diese Normal Maps nochmal angepasst.\n'}/>
            <SwitchSetting id='useVertexNormalsSwitch' checked={useVertexNormals} setter={setUseVertexNormals} text='Use vertex normals'
                            tooltip={'Diese Einstellung führt zu einer schnelleren Berechnung, kann aber zu mehr Artefakten führen.\n'}/>
            <SliderSetting id='creaseAngleSlider' value={creaseAngle} setter={setCreaseAngle} text='Crease angle' min={1} max={150}
                            tooltip={'Mit dem "crease_angle" wird angegeben, ab wann Kanten als Knicke definiert werden. \n' +
                                'Wenn scharfe Kanten im Modell enthalten sind, kann ein zu großer Winkel zu\n' +
                                'Artefakten führen. Um diese zu beseitigen, sollte hier ein kleinerer Winkel gewählt\n' +
                                'werden.'}/>
            <SliderSetting id='normalDeviationSlider' value={normalDeviation} setter={setNormalDeviation} text='Normal deviation' min={1} max={100}
                            tooltip={'Diese Einstellung gibt an, wie stark das Ergebnis vom Inputmesh abweichen darf.\n' +
                                'Ein höherer Wert führt zu größeren Fehlern, ein zu kleiner Wert verhindert die Vereinfachung.\n' +
                                'Normalerweise sollte dieser Wert zwischen 5 und 15 Grad betragen.'}/>
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
        <span title={tooltip}>{text}</span>
    </Label>
}

const SliderSetting = ({id, value, setter, text, min, max, tooltip}) => {
    return <Pane maxWidth={200}>
        <Typography title={tooltip} id={id} gutterBottom style={{ textAlign: 'left' }}>
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