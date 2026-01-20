import { useEffect, useState } from 'react'
import { TabButton } from '../StyledComponents/TabButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from 'react-tooltip'
import { useTranslation } from '../../LocalizationContext'

interface props {
    setId: (id: number) => void
    hidden: boolean
    isInTutorialMode: boolean
    returnToWelcomeScreen: () => void
}

const tooltipIconStyle = { marginLeft: 10, fontSize: 14 }

export const TabHeader = ({ setId, hidden, isInTutorialMode, returnToWelcomeScreen }) => {
    const { translate, language, setLanguage } = useTranslation()
    const [lastClicked, setLastClicked] = useState<number>(1)
    const [isDisabled, setDisabled] = useState(false)

    const handleClick = (id: number) => {
        if (!isDisabled) {
            setId(id);
            setLastClicked(id);
        }
    };

    useEffect(() => {
        api.on(api.channels.fromMain.externalWindowOpened, () => setDisabled(true))
        api.on(api.channels.fromMain.externalWindowClosed, () => setDisabled(false))
    }, [])

    return (
        <div hidden={hidden} style={{
            textAlign: 'left',
            backgroundColor: '#1A1A1A',
            position: 'fixed',
            width: '100%',
            top: '0px',
            zIndex: 2,
        }}>
            <div style={{ paddingTop: '5px', paddingRight: '0px', paddingLeft: '0px', display: 'inline-block' }}>
                {isInTutorialMode ?
                    <TabButton disabled={false} onClick={returnToWelcomeScreen}>
                        {translate('exit_tutorial')}
                    </TabButton>
                    : <>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(6)} style={lastClicked === 6 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('optimize')}
                            <HelpOutlineIcon data-tooltip-id="Optimize" data-tooltip-content={translate('optimize_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Optimize" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(1)} style={lastClicked === 1 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('objects')}
                            <HelpOutlineIcon data-tooltip-id="Objects" data-tooltip-content={translate('objects_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Objects" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(2)} style={lastClicked === 2 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('behaviors')}
                            <HelpOutlineIcon data-tooltip-id="Behaviors" data-tooltip-content={translate('behaviors_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Behaviors" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(3)} style={lastClicked === 3 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('characters')}
                            <HelpOutlineIcon data-tooltip-id="Avatars" data-tooltip-content={translate('characters_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Avatars" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(4)} style={lastClicked === 4 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('articy')}
                            <HelpOutlineIcon data-tooltip-id="Articy" data-tooltip-content={translate('articy_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Articy" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                        <TabButton disabled={isDisabled} onClick={() => handleClick(7)} style={lastClicked === 7 ? { background: '#3A4048', color: '#FFFFFF' } : {}}>
                            {translate('export')}
                            <HelpOutlineIcon data-tooltip-id="Export" data-tooltip-content={translate('export_tooltip')} style={tooltipIconStyle} />
                            <Tooltip id="Export" place="bottom" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                        </TabButton>
                    </>
                }
            </div>
        </div>
    );
};
