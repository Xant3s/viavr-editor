import { Spinner } from 'evergreen-ui'

export const CenteredSpinner = ({size = 64, showLabel = true}) => {
    return <div style={{
        width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column', color: 'white',
    }}>
        <Spinner size={size} />
        {showLabel &&
            <div style={{ fontSize: '24px', marginTop: '16px' }}>Loading...</div>
        }
    </div>
}