import { useEffect, useState } from 'react'
import { TabButton } from '../StyledComponents/TabButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Tooltip} from 'react-tooltip'


interface props {
    setId: (id: number) => void
    hidden: boolean
    isInTutorialMode: boolean
    returnToWelcomeScreen: () => void
}

const tooltipIconStyle = { marginLeft: 10, fontSize: 14 }


export const TabHeader = ({ setId, hidden, isInTutorialMode, returnToWelcomeScreen}) => {
    const [lastClicked, setLastClicked] = useState<number>(1)
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
                        <TabButton disabled={isDisabled} onClick={() => handleClick(6)} style={lastClicked === 6 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Optimize
                            <HelpOutlineIcon data-tooltip-id="Optimize" data-tooltip-content="Optimize 3D objects in the .glb file format." style={tooltipIconStyle}/>
                            <Tooltip id="Optimize" place="bottom" style={{fontSize: '14px'}} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Objects
                            <HelpOutlineIcon data-tooltip-id="Objects" data-tooltip-content="Create and edit objects in the scene." style={tooltipIconStyle}/>
                            <Tooltip id="Objects" place="bottom" style={{fontSize: '14px'}} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Behaviors
                            <HelpOutlineIcon data-tooltip-id="Behaviors" data-tooltip-content="Tag objects and create events." style={tooltipIconStyle}/>
                            <Tooltip id="Behaviors" place="bottom" style={{fontSize: '14px'}} />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Avatars
                            <HelpOutlineIcon data-tooltip-id="Avatars" data-tooltip-content="Create and download characters via the VIA-VR avatar app." style={tooltipIconStyle}/>
                            <Tooltip id="Avatars" place="bottom" style={{fontSize: '14px'}} />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Articy
                            <HelpOutlineIcon data-tooltip-id="Articy" data-tooltip-content="Use the Articy editor to create dialogs and assign dialogs to characters."  style={tooltipIconStyle}/>
                            <Tooltip id="Articy" place="bottom" style={{fontSize: '14px'}} />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(5)} style={lastClicked === 5 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Share
                            <HelpOutlineIcon data-tooltip-id= "Share"data-tooltip-content="(Experimental) Share the project." style={tooltipIconStyle}/>
                            <Tooltip id="Share" place="bottom" style={{fontSize: '14px'}} />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(7)} style={lastClicked === 7 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Finish
                            <HelpOutlineIcon data-tooltip-id="Finish" data-tooltip-content="Create the experience, select and configure additional features." style={tooltipIconStyle}/>
                            <Tooltip id="Finish" place="bottom" style={{fontSize: '14px'}} />
                            </TabButton>

                    </>
                }
            </div>
        </div>
    );
};

