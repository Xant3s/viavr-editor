import {SettingAccordion} from '../Settings/SettingAccordion'
import {useEffect, useState} from 'react'
import {Setting_t} from '../../@types/Settings'
import {Setting} from '../Settings/Setting'

export const UnityPackageConfigurations = ({packages}) => {
    const [packageConfig, setPackageConfig] = useState<any>({})

    useEffect(() => {
        // TODO: set state, filter packages with configDescription, filter selected packages
        // TODO: does this component has to have a state?
        if(packages.length === 0) return
        setPackageConfig(packages[0]['configDescription'])
        // console.log(packageConfig)
    }, [packages])

    const draw = (packageDescription) => {
        return <>
            {
                Object.entries(packageDescription['configDescription'])
                      .map(([name, setting]) => {
                          const id = packageDescription['name'] + '.' + name
                          return <Setting key={id} settingKey={id} setting={setting} />
                })
            }
        </>
    }

    return (
        <>
            {
                // TODO: filter packages with configDescription, filter selected packages
                packages.map(packageConfig => <SettingAccordion key={`config-${packageConfig.packageName}`} summary={packageConfig['name']} details={draw(packageConfig)}/>)
            }
        </>
    )
}
