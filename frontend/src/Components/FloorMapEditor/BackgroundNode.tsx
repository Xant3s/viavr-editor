export const BackgroundNode = ({ data }) => {
    const src = data['label']
    return (
        <div style={{ width: '100', height: '100', visibility:'visible'}}>
            <div
                style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    zIndex: -1, // set z-index to render beneath other nodes
                }}
            >
                <img
                    src={src}
                    alt=''
                    style={{
                        display: 'block',
                        width: '100',
                        height: '100',
                        objectFit: 'cover',
                    }}
                />
            </div>
        </div>
    )
}