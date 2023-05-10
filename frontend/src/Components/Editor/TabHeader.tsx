import { useState } from 'react';
import { TabButton } from '../StyledComponents/TabButton';

export const TabHeader = ({ setId, hidden = false }) => {
    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (id) => {
        setId(id);
        setLastClicked(id);
    };

    return (
        <div hidden={hidden} style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
            <div style={{ padding: 5, display: 'inline-block' }}>
                <TabButton onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#0550b3' } : {}}>Objects</TabButton>
                <TabButton onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#0550b3' } : {}}>Behaviors</TabButton>
                <TabButton onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#0550b3' } : {}}>Avatars</TabButton>
                <TabButton onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#0550b3' } : {}}>Articy</TabButton>
                <TabButton onClick={() => handleClick(5)} style={lastClicked === 5 ? { background: '#0550b3' } : {}}>Share</TabButton>
            </div>
        </div>
    );
};

