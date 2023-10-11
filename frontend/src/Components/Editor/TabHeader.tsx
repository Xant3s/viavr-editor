import { useEffect, useState } from 'react'
import { TabButton } from '../StyledComponents/TabButton';


interface props {
    setId: (id: number) => void
    hidden: boolean
    isInTutorialMode: boolean
    returnToWelcomeScreen: () => void
}

export const TabHeader = ({ setId, hidden, isInTutorialMode, returnToWelcomeScreen}) => {
    const [lastClicked, setLastClicked] = useState<number>(-1)
    const [isDisabled, setDisabled] = useState(false)
    
    
    const handleClick = (id: number) => {
        if(!isDisabled) {
            setId(id);
            setLastClicked(id);
        }
    };

    useEffect(() => {
        api.on(api.channels.fromMain.externalWindowOpened, () => setDisabled(true))
        api.on(api.channels.fromMain.externalWindowClosed, () => setDisabled(false))
    }, [])

    return (
        <div hidden={hidden} style={{ textAlign: 'left', backgroundColor: '#1A1A1A' }}>
            <div style={{ paddingTop: '5px', paddingRight: '0px', paddingLeft: '0px', display: 'inline-block' }}>
                {isInTutorialMode ? <TabButton disabled={false} onClick={returnToWelcomeScreen}>Exit Tutorial</TabButton>
                    : <>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(6)} style={lastClicked === 6 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Optimize</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Objects</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Behaviors</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Avatars</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Articy</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(5)} style={lastClicked === 5 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Share</TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(7)} style={lastClicked === 7 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>Finish</TabButton>

                    </>
                }
            </div>
        </div>
    );
};

