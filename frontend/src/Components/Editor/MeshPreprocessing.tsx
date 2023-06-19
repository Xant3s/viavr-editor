import {
    Alert,
    FileCard,
    FileRejectionReason,
    FileUploader, Label,
    majorScale,
    Pane,
    rebaseFiles, Switch,
    toaster,
} from 'evergreen-ui'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Button } from '../StyledComponents/Button'
import { SettingAccordion } from '../Settings/SettingAccordion'
import { Slider } from '@mui/material'
import Typography from '@mui/material/Typography'


export const MeshPreprocessing = ({ hidden }) => {
    const maxFiles = 1
    const [percentValue, setPercentValue] = useState<number>(50)
    const [embedTextures, setEmbedTextures] = useState<boolean>(true)
    const [embedBuffers, setEmbedBuffers] = useState<boolean>(true)
    const [noNormalMaps, setNoNormalMaps] = useState<boolean>(false)
    const [adjustExistingNormalMaps, setAdjustExistingNormalMaps] = useState<boolean>(false)
    const [useVertexNormals, setUseVertexNormals] = useState<boolean>(false)
    const [creaseAngle, setCreaseAngle] = useState<number>(70)
    const [normalDeviation, setNormalDeviation] = useState<number>(10)
    const [files, setFiles] = useState<any[]>([])
    const [fileRejections, setFileRejections] = useState<any[]>([])

    const values = useMemo(() => [...files, ...fileRejections.map((fileRejection) => fileRejection.file)], [
        files,
        fileRejections,
    ])

    const handleRemove = useCallback(
        (file) => {
            const updatedFiles = files.filter((existingFile) => existingFile !== file)
            const updatedFileRejections = fileRejections.filter((fileRejection) => fileRejection.file !== file)

            // Call rebaseFiles to ensure accepted + rejected files are in sync (some might have previously been
            // rejected for being over the file count limit, but might be under the limit now!)
            const { accepted, rejected } = rebaseFiles(
                [...updatedFiles, ...updatedFileRejections.map((fileRejection) => fileRejection.file)],
                { maxFiles }
            )

            setFiles(accepted)
            setFileRejections(rejected)
        },
        [files, fileRejections, maxFiles]
    )

    const fileCountOverLimit = files.length + fileRejections.length - maxFiles
    const fileCountError = `You can upload up to ${maxFiles} files. Please remove ${fileCountOverLimit} ${
        fileCountOverLimit === 1 ? 'file' : 'files'
    }.`

    async function runPreprocessor(e) {
        e.preventDefault()
        const paths = files.map(file => file.path)
        if(files.some(p => !p.name.endsWith('.gltf'))) {
            toaster.danger('Only .gltf files are supported')
            return
        }
        const status = await api.invoke(api.channels.toMain.runPreprocessor, paths, percentValue, embedTextures, embedBuffers)
        if(status === 200) {
            toaster.success('Optimization successful')
            handleRemove(files[0])
        } else {
            toaster.danger('Could not process this file')
            handleRemove(files[0])
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
                <FileUploader
                    disabled={files.length + fileRejections.length >= maxFiles}
                    maxFiles={maxFiles}
                    onAccepted={setFiles}
                    onRejected={setFileRejections}
                    renderFile={(file, index) => {
                        const { name, size, type } = file
                        const renderFileCountError = index === 0 && fileCountOverLimit > 0

                        // We're displaying an <Alert /> component to aggregate files rejected for being over the maxFiles limit,
                        // so don't show those errors individually on each <FileCard />
                        const fileRejection = fileRejections.find(
                            (fileRejection) => fileRejection.file === file && fileRejection.reason !== FileRejectionReason.OverFileLimit
                        )
                        const { message } = fileRejection || {}

                        return (
                            <Fragment key={`${file.name}-${index}`}>
                                {renderFileCountError && <Alert intent="danger" marginBottom={majorScale(2)} title={fileCountError} />}
                                <FileCard
                                    isInvalid={fileRejection != null}
                                    name={name}
                                    onRemove={() => handleRemove(file)}
                                    sizeInBytes={size}
                                    type={type}
                                    validationMessage={message}
                                />
                            </Fragment>
                        )
                    }}
                    values={values}
                    style={{maxWidth: '654'}}
                />
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
            <Button type='submit' disabled={files.length === 0}>Optimize</Button>
        </form>
    </div>
}