import { useEffect, useState } from 'react'
import { Checkbox } from '../Utils/UI'
import { Button } from '../StyledComponents/Button'

export const SupervisorMonitorSettings = () => {
    const [useSupervisorMonitor, setUseSupervisorMonitor] = useState(false)
    const [useFloorMap, setUseFloorMap] = useState(false)


    const openFloorMapEditor = () => {
        console.log('open floor map editor')
    }

    const loadSettings = async () => {
        const supervisorEnabledSetting = (await api.invoke(api.channels.toMain.getBuildSetting, 'supervisorEnabled')) || false
        setUseSupervisorMonitor(supervisorEnabledSetting)
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const toggleSupervisorMonitor = async () => {
        await api.invoke(api.channels.toMain.setBuildSetting, 'supervisorEnabled', !useSupervisorMonitor)
        setUseSupervisorMonitor(!useSupervisorMonitor)
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
                          onChange={() => setUseFloorMap(!useFloorMap)}
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