import { useEffect, useState } from 'react'
import { TabButton } from '../StyledComponents/TabButton';

export const TabHeader = ({ setId, hidden = false }) => {

    const [lastClicked, setLastClicked] = useState(null);
    const [isDisabled, setDisabled] = useState(false);
    const handleClick = (id) => {
        if(!isDisabled) {
            setId(id);
            setLastClicked(id);
        }
    };

    useEffect(() => {
        api.on(api.channels.fromMain.externalWindowOpened, () => setDisabled(true))
        api.on(api.channels.fromMain.externalWindowClosed, () =>{ setDisabled(false)
        console.log("I was called here")
        })
    }, [])

    const onExternalWindowOpened = () => setDisabled(true)
    const onExternalWindowClosed = () => setDisabled(false)

    return (
        <div hidden={hidden} style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
            <div style={{ padding: 5, display: 'inline-block' }}>
                <TabButton disabled={isDisabled} onClick={() => handleClick(6)} style={lastClicked === 6 ? { background: '#0550b3' } : {}}>Optimize</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#0550b3' } : {}}>Objects</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#0550b3' } : {}}>Behaviors</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#0550b3' } : {}}>Avatars</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#0550b3' } : {}}>Articy</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(5)} style={lastClicked === 5 ? { background: '#0550b3' } : {}}>Share</TabButton>
                <TabButton disabled={isDisabled} onClick={() => handleClick(7)} style={lastClicked === 7 ? { background: '#0550b3' } : {}}>Finish</TabButton>
            </div>
        </div>
    );
};

