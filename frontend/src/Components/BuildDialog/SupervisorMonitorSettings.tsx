import { useEffect, useState } from 'react'
import { Checkbox } from '../Utils/UI'
import { Button } from '../StyledComponents/Button'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from 'react-tooltip'
import { useTranslation } from '../../LocalizationContext'

export const SupervisorMonitorSettings = ({ hidden }) => {
    const { translate, language, setLanguage } = useTranslation()
    const [useSupervisorMonitor, setUseSupervisorMonitor] = useState(false)
    const [useFloorMap, setUseFloorMap] = useState(false)


    const openFloorMapEditor = async () => {
        await api.invoke(api.channels.toMain.openFloorMapEditor)
    }

    const loadSettings = async () => {
        const supervisorEnabledSetting = (await api.invoke(api.channels.toMain.getBuildSetting, 'supervisorEnabled')) || false
        const floormapEnabledSetting = (await api.invoke(api.channels.toMain.getBuildSetting, 'useFloorMap')) || false
        setUseSupervisorMonitor(supervisorEnabledSetting)
        setUseFloorMap(floormapEnabledSetting)
    }

    useEffect(() => {
        if (hidden) return
        loadSettings()
    }, [hidden])

    const toggleSupervisorMonitor = async () => {
        await api.invoke(api.channels.toMain.setBuildSetting, 'supervisorEnabled', !useSupervisorMonitor)
        setUseSupervisorMonitor(!useSupervisorMonitor)
        setUseFloorMap(false)
    }

    const toggleFloorMap = async () => {
        await api.invoke(api.channels.toMain.setBuildSetting, 'useFloorMap', !useFloorMap)
        setUseFloorMap(!useFloorMap)
    }


    return <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
                id={'useSupervisorMonitor'}
                checked={useSupervisorMonitor}
                onChange={() => toggleSupervisorMonitor()}
                label={translate('supervisorMonitorSettings.useSupervisorMonitor')}
            />
            <HelpOutlineIcon
                data-tooltip-id="my-tooltip"
                data-tooltip-html={translate('supervisorMonitorSettings.useSupervisorMonitorTooltip')}
                data-tooltip-place="right"
                style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }}
            />
        </div>
        <Tooltip id="my-tooltip" style={{ maxWidth: '300px', whiteSpace: 'normal' }} />
        {
            useSupervisorMonitor && <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox id={'useFloorMap'}
                        checked={useFloorMap}
                        onChange={() => toggleFloorMap()}
                        label={translate('supervisorMonitorSettings.useFloorMap')}
                    />
                    <HelpOutlineIcon
                        data-tooltip-id="my-tooltip"
                        data-tooltip-html={translate('supervisorMonitorSettings.useFloorMapTooltip')}
                        data-tooltip-place="right"
                        style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }}
                    />
                </div>
                <Tooltip id="my-tooltip" style={{ maxWidth: '300px', whiteSpace: 'normal' }} />
                {
                    useFloorMap && <Button id='btn-open-floor-map-editor' type='button' onClick={() => openFloorMapEditor()}>
                        {translate('supervisorMonitorSettings.createFloorMap')}
                    </Button>
                }
            </>
        }
    </>
}