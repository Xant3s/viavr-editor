import { FileCard, FileUploader, MimeType, Pane, toaster } from 'evergreen-ui'
import { useCallback, useState } from 'react'
import { Button } from '../StyledComponents/Button'

export const MeshPreprocessing = ({ hidden }) => {
    const [files, setFiles] = useState<any[]>([])
    const [fileRejections, setFileRejections] = useState<any[]>([])

    const handleChange = useCallback((files) => setFiles([files[0]]), [])
    const handleRejected = useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
    const handleRemove = useCallback(() => {
        setFiles([])
        setFileRejections([])
    }, [])


    function runPreprocessor(e) {
        e.preventDefault()
        toaster.notify('not implemented yet')
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
        {/*'model/gltf+json '*/}
        <form onSubmit={runPreprocessor}>
            <div>TODO: info how to use</div>
            <Pane maxWidth={654}>
                <FileUploader
                    maxFiles={1}
                    onChange={handleChange}
                    onRejected={handleRejected}
                    renderFile={(file) => {
                        const { name, size, type } = file
                        const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
                        const { message } = fileRejection || {}
                        return (
                            <FileCard
                                key={name}
                                isInvalid={fileRejection != null}
                                name={name}
                                onRemove={handleRemove}
                                sizeInBytes={size}
                                type={type}
                                validationMessage={message}
                            />
                        )
                    }}
                    values={files}
                />
            </Pane>

            <details>
                <summary>Advanced Settings</summary>
                Test2
            {/*    percent, use textures, output file, use buffers*/}
            </details>
            <Button type='submit' disabled={files.length === 0}>Optimize</Button>
        </form>
    </div>
}