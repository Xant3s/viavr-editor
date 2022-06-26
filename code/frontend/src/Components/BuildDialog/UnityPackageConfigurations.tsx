import {SettingAccordion} from '../Settings/SettingAccordion'
import {Setting} from '../Settings/Setting'
import {value_t} from '../../@types/Settings'
import {useEffect, useState} from 'react'

export const UnityPackageConfigurations = ({packages}) => {
    const [packageDescriptions, setPackageDescriptions] = useState<any[]>([])

    const sendUpdateToBackend = (uuid: string, newValue: value_t) => {
        api.send(api.channels.toMain.changePackageSetting, uuid, newValue)
    }

    useEffect(() => {
        const loadPackageSettings = async() => {
            for(const packageDescription of packages) {
                const packageConfig = await api.invoke(api.channels.toMain.getPackageSetting, packageDescription.name)
                if(packageConfig !== undefined) {
                    packageDescription.configDescription = packageConfig.value
                }
            }
            setPackageDescriptions(packages)
        }

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
    }, [packages])

    const drawPackageConfig = (packageDescription) => {
        return <>
            {
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
