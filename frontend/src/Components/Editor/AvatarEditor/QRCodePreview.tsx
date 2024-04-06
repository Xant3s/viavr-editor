import SVG from 'react-inlinesvg'
import * as React from 'react'


interface props {
    qrCode: string
    avatarName: string
}

export const QRCodePreview = ({ qrCode, avatarName }: props) => {
    return <div>
        Scan this QR code with the VIA-VR character app:
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            marginTop: '5px',
        }}>
            <SVG src={qrCode} width={256} />
            <div>Character: {avatarName}</div>
        </div>
    </div>
}