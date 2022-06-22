import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'
import {DropDownPreference} from './DropDownPreference'
import {ListPreference} from './ListPreference'
import {PreferenceEntry} from '../StyledComponents/Preferences/StyledPreferences'
import {BoolPreference} from './BoolPreference'
import {FloatPreference, IntPreference} from './NumberPreference'
import { CompositePreference } from './CompositePreference'
import {Setting_t, value_t} from '../../@types/Settings'
import {useEffect, useState} from 'react'

// type Kind = 'string' | 'boolean' | 'int' | 'float' | 'path' | 'dropdown' | 'composite' | 'list'
// const emptyList: string[] = []

export const Setting = ({settingKey, setting, updateCallback = (newValue: value_t) => {}}) => {
    const [value, setValue] = useState<value_t>()

    useEffect(() => {
        setValue(setting.value as value_t)
    }, [])

    const updateSetting = (newValue: value_t) => {
        setValue(newValue)
        updateCallback(newValue)
    }

    const getSetting = () => {
        // console.log('getSetting', value)

        switch(setting.kind) {
            case 'string':
                return (<StringPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} />)
            case 'boolean':
                return (<BoolPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} />)
            case 'int':
                return (<IntPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} min={setting.min} max={setting.max} />)
            case 'float':
                return (<FloatPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} min={setting.min} max={setting.max} />)
            case 'path':
                return (<PathPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} />)
            case 'dropdown':
                return (<DropDownPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} options={setting.options} />)
            // case 'composite':
            //     return (<CompositePreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} createPrefComponent={getSetting} />)
            // case 'list':
            //     return (<ListPreference id={settingKey} label={setting.label} value={value} onChange={updateSetting} createPrefComponent={getSetting} />)
            default:
                return (<div>Unknown setting kind: {setting.kind}</div>)
        }
    }

    return (
        <PreferenceEntry>
            {getSetting()}
            <br/>
        </PreferenceEntry>
    )
}

// export const Preference = ({id, label, value, onChange, kind = 'string', options = emptyList, min=undefined, max=undefined, createPrefComponent}) => {
//     const getPreference = (kind: Kind) => {
//         switch(kind) {
//             case 'boolean':
//                 return BoolPreference({id, label, value, onChange})
//             case 'int':
//                 return IntPreference({id, label, value, onChange, min, max})
//             case 'float':
//                 return FloatPreference({id, label, value, onChange, min, max})
//             case 'path':
//                 return PathPreference({id, label, value, onChange})
//             case 'dropdown':
//                 return DropDownPreference({id, label, value, onChange, options})
//             case 'composite':
//                 return CompositePreference({id, label, value, onChange, createPrefComponent})
//             case 'list':
//                 return ListPreference({id, label, value, onChange, createPrefComponent})
//             case 'string':  // fallthrough
//             default:
//                 return StringPreference({id, label, value, onChange})
//         }
//     }
//
//     return (
//         <PreferenceEntry>
//             {getPreference(kind as Kind)}
//             <br/>
//         </PreferenceEntry>
//     )
// }
