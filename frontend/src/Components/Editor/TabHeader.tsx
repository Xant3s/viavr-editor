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
                            <HelpOutlineIcon data-tooltip-id="Optimize" data-tooltip-content="This tab allows for the optimization of 3D objects in the .gltf file format." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Optimize" place="bottom"  />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Objects
                            <HelpOutlineIcon data-tooltip-id="Objects" data-tooltip-content="This tab lets allows for the creation and editing of objects in the scene." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Objects" place="bottom" />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Behaviors
                            <HelpOutlineIcon data-tooltip-id="Behaviors" data-tooltip-content="This tab allows for the creation and editing of meta data, variables and events." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Behaviors" place="bottom"  />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Avatars
                            <HelpOutlineIcon data-tooltip-id="Avatars" data-tooltip-content="This tab allows for the creation and download of avatars via the VIA-VR avatar app." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Avatars" place="bottom"  />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Articy
                            <HelpOutlineIcon data-tooltip-id="Articy" data-tooltip-content="This tab serves as an interface for articy."  style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Articy" place="bottom"  />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(5)} style={lastClicked === 5 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Share
                            <HelpOutlineIcon data-tooltip-id= "Share"data-tooltip-content="This tab allows you to share the project." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Share" place="bottom"  />
                            </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(7)} style={lastClicked === 7 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            Finish
                            <HelpOutlineIcon data-tooltip-id="Finish" data-tooltip-content="This tab is used to export the project, select used packages and create and edit floor maps." style={{ color: '#4D535B', marginLeft: 10,fontSize: 14 }}/>
                            <Tooltip id="Finish" place="bottom"  />
                            </TabButton>

                    </>
                }
            </div>
        </div>
    );
};

