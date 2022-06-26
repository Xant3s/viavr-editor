import {SettingAccordion} from '../Settings/SettingAccordion'
import {Setting} from '../Settings/Setting'
import {value_t} from '../../@types/Settings'
import {useEffect} from 'react'

export const UnityPackageConfigurations = ({packages}) => {
    const sendUpdateToBackend = (uuid: string, newValue: value_t) => {
        api.send(api.channels.toMain.changePackageSetting, uuid, newValue)
    }

    useEffect(() => {
        // TODO: load package settings from backend

        const ensurePackageSettingsExist = async() => {
            for(const packageDescription of packages) {
                await api.invoke(api.channels.toMain.setPackageSetting, packageDescription.name, packageDescription.configDescription)
            }
        }

        ensurePackageSettingsExist()
    }, [packages])

    const draw = (packageDescription) => {
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
        packages.map(packageConfig =>
            <SettingAccordion key={`config-${packageConfig.packageName}`} summary={packageConfig['name']} details={draw(packageConfig)}/>)
    }</>
}
