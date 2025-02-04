import SVG from 'react-inlinesvg'
import * as React from 'react'
import { useTranslation } from '../../../LocalizationContext'

interface props {
    qrCode: string
    avatarName: string
}

export const QRCodePreview = ({ qrCode, avatarName }: props) => {
    const { translate, language, setLanguage } = useTranslation()

    return <div>
        {translate('qr_code_instruction')}
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
