export const ImageNode = ({ data }) => {
    const id = data['id']
    const src = data['label']
    const type = data['type']
    const showTriggerConfigEditor = data['showNoteConfigEditor']
    return (
        <img
            src={src}
            alt=""
            style={{
                display: 'block',
                width: '50%',
                height: '50%',
                objectFit: 'cover',
                cursor: 'move',
            }}
            onClick={() => {
                showTriggerConfigEditor(id)
            }}
        />
    )
}
