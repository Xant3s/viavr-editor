import { TabButton } from '../StyledComponents/TabButton'

export const TabHeader = ({ setId, hidden = false }) => {
    return <div hidden={hidden} style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
        <div style={{ padding: 5, display: 'inline-block' }}>
            <TabButton onClick={() => setId(1)}>Objects</TabButton>
            <TabButton onClick={() => setId(2)}>Behaviors</TabButton>
            <TabButton onClick={() => setId(3)}>Avatars</TabButton>
            <TabButton onClick={() => setId(4)}>Articy</TabButton>
            <TabButton onClick={() => setId(5)}>Share</TabButton>
        </div>
    </div>
}
