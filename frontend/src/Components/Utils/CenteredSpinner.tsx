import { Spinner } from 'evergreen-ui'
import { useTranslation } from '../../LocalizationContext'

export const CenteredSpinner = ({size = 64, showLabel = true}) => {
    const {translate} = useTranslation()
   
    return <div style={{
        width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column', color: 'white',
    }}>
        <Spinner size={size} />
        {showLabel &&
            <div style={{ fontSize: '24px', marginTop: '16px' }}>{translate('loading')}</div>
        }
    </div>
}