import { useEffect, useState } from 'react'
import { Checkbox } from '../Utils/UI'
import { Button } from '../StyledComponents/Button'

export const SupervisorMonitorSettings = ({hidden}) => {
    const [useSupervisorMonitor, setUseSupervisorMonitor] = useState(false)
    const [useFloorMap, setUseFloorMap] = useState(false)


    const openFloorMapEditor = async () => {
        await api.invoke(api.channels.toMain.openFloorMapEditor)
    }

    const loadSettings = async () => {
        const supervisorEnabledSetting = (await api.invoke(api.channels.toMain.getBuildSetting, 'supervisorEnabled')) || false
        setUseSupervisorMonitor(supervisorEnabledSetting)
    }

    useEffect(() => {
        if(hidden) return
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
        <Checkbox id={'useSupervisorMonitor'}
                  title={'Whether to use the supervisor monitor'}
                  checked={useSupervisorMonitor}
                  onChange={() => toggleSupervisorMonitor()}
                  label={'Use supervisor monitor'}
        />

        {
            useSupervisorMonitor && <>
                <Checkbox id={'useFloorMap'}
                          title={'Whether to use a floor map'}
                          checked={useFloorMap}
                          onChange={() => toggleFloorMap()}
                          label={'Use floor map'}
                />
                {
                    useFloorMap && <Button id='btn-open-floor-map-editor' type='button' onClick={() => openFloorMapEditor()}>
                        Create Floor Map
                    </Button>
                }
            </>
        }
    </>
}