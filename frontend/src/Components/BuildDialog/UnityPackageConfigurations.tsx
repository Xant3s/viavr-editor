import {SettingAccordion} from '../Settings/SettingAccordion'
import {Setting} from '../Settings/Setting'
import {value_t} from '../../@types/Settings'
import {useEffect, useState} from 'react'

export const UnityPackageConfigurations = ({packages}) => {
    const [packageDescriptions, setPackageDescriptions] = useState<any[]>([])
    const [visible, setVisible] = useState(true)    // used to force redraw, no other purpose

    const loadPackageSettings = async() => {
        for(const packageDescription of packages) {
            const packageConfig = await api.invoke(api.channels.toMain.getPackageSetting, packageDescription.name)
            if(packageConfig !== undefined) {
                packageDescription.configDescription = packageConfig.value
            }
        }
        setPackageDescriptions(packages)
        setVisible(true)
    }

    const sendUpdateToBackend = async (uuid: string, newValue: value_t) => {
        await api.invoke(api.channels.toMain.changePackageSetting, uuid, newValue)
        setVisible(false)
        await loadPackageSettings()
    }

    useEffect(() => {
        const ensurePackageSettingsExist = async() => {
            for(const packageDescription of packages) {
                await api.invoke(api.channels.toMain.setPackageSetting, packageDescription.name, packageDescription.configDescription)
            }
        }

        const init = async() => {
            await loadPackageSettings()
            await ensurePackageSettingsExist()
        }

        init()
    })

    const drawPackageConfig = (packageDescription) => {
        return <>
            { (visible || true) &&
                Object.entries(packageDescription['configDescription'])
                      .map(([name, setting]) => {
                          const id = packageDescription['name'] + '.' + name
                          return <Setting key={id} settingKey={id} setting={setting} updateCallback={sendUpdateToBackend} />
                })
            }
        </>
    }

    return <>{
        packageDescriptions.map(packageConfig =>
            <SettingAccordion key={`config-${packageConfig.packageName}`} summary={packageConfig['displayName']} details={drawPackageConfig(packageConfig)}/>)
    }</>
}
