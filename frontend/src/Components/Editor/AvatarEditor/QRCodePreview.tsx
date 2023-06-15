import SVG from 'react-inlinesvg'
import * as React from 'react'

export const QRCodePreview = ({ qrCode }) => {
    return <div>
        Scan this QR code with the VIA-VR avatar app:
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            marginTop: '5px',
        }}>
            <SVG src={qrCode} width={256} height='auto' />
        </div>
    </div>
}