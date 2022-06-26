import {SettingAccordion} from '../Settings/SettingAccordion'
import {Setting} from '../Settings/Setting'

export const UnityPackageConfigurations = ({packages}) => {
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

    return <>{
        packages.map(packageConfig =>
            <SettingAccordion key={`config-${packageConfig.packageName}`} summary={packageConfig['name']} details={draw(packageConfig)}/>)
    }</>
}
