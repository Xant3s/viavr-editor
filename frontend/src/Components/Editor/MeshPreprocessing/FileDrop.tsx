import { Alert, FileCard, FileRejectionReason, FileUploader, majorScale, rebaseFiles } from 'evergreen-ui'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

export const FileDrop = ({maxFiles, setFilePaths}) => {
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


    useEffect(() => {
        setFilePaths(files.map(file => file.path))
    }, [files, setFilePaths])

    return <FileUploader
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
}