import {
    Alert,
    FileCard,
    FileRejectionReason,
    FileUploader, Label,
    majorScale,
    MimeType,
    Pane,
    rebaseFiles, Switch,
    toaster,
} from 'evergreen-ui'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Button } from '../StyledComponents/Button'
import { SettingAccordion } from '../Settings/SettingAccordion'
import { Slider } from '@mui/material'
import Typography from '@mui/material/Typography'
import { alignProperty } from '@mui/material/styles/cssUtils'


export const MeshPreprocessing = ({ hidden }) => {
    const [percentValue, setPercentValue] = useState<number>(50)
    const [embedTextures, setEmbedTextures] = useState<boolean>(true)
    const [embedBuffers, setEmbedBuffers] = useState<boolean>(true)

    {/*'model/gltf+json '*/}

    // type MimeType = {
    //     jpeg: 'image/jpeg',
    //     pdf: 'application/pdf',
    //     gltf: 'model/gltf+json', // Add the gltf mimetype here
    // };

    type ExtendedMimeType = MimeType | 'model/gltf+json'

    const acceptedMimeTypes: MimeType[] = [MimeType.json]
    const maxFiles = 1
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
                { acceptedMimeTypes, maxFiles }
            )

            setFiles(accepted)
            setFileRejections(rejected)
        },
        [acceptedMimeTypes, files, fileRejections, maxFiles]
    )

    const fileCountOverLimit = files.length + fileRejections.length - maxFiles
    const fileCountError = `You can upload up to ${maxFiles} files. Please remove ${fileCountOverLimit} ${
        fileCountOverLimit === 1 ? 'file' : 'files'
    }.`


    async function runPreprocessor(e) {
        e.preventDefault()
        // toaster.notify('not implemented yet')
        console.log(files)
        const paths = files.map(file => file.path)
        const status = await api.invoke(api.channels.toMain.runPreprocessor, paths, percentValue, embedTextures, embedBuffers)
        console.log(status)
        toaster.notify(status)
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
        <form onSubmit={runPreprocessor}>
            <div>You can optimize one file at a time. You can only optimize .gltf file formats.
                The optimized files will be named &apos;[original name]_optimized.gltf&apos; and saved next to the originals.</div>
            {/*<Pane maxWidth={654}>*/}
            {/*<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*TODO: only allow .gltf files */}
                <FileUploader
                    // acceptedMimeTypes={acceptedMimeTypes}
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
            {/*</div>*/}
            {/*</Pane>*/}

            {/*    percent, use textures, output file, use buffers*/}
            <SettingAccordion summary={'Advanced Settings'} details={
                <>
                    <Typography id="non-linear-slider" gutterBottom>
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
                    <Label htmlFor="embedTexturesSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                        <Switch
                            id="embedTexturesSwitch"
                            checked={embedTextures}
                            onChange={(e) => setEmbedTextures(e.target.checked)}
                            marginRight={8}
                        />
                        <span>Embed Textures</span>
                    </Label>

                    <Label htmlFor="embedBuffersSwitch" marginBottom={8} display="flex" alignItems="left" justifyContent="left" color="white">
                        <Switch
                            id="embedBuffersSwitch"
                            checked={embedBuffers}
                            onChange={(e) => setEmbedBuffers(e.target.checked)}
                            marginRight={8}
                        />
                        <span>Embed Buffers</span>
                    </Label>
                </>
            } />
            <Button type='submit' disabled={files.length === 0}>Optimize</Button>
        </form>
    </div>
}