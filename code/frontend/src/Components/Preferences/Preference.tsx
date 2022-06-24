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


export const Setting = ({settingKey, setting, updateCallback = (uuid: string, newValue: value_t) => {}}) => {
    const [value, setValue] = useState<value_t>()

    useEffect(() => {
        setValue(setting.value)
    }, [setting.value])

    const updateSetting = (uuid: string, newValue: value_t) => {
        let isComposite = setting.kind === 'composite' || (setting.kind === 'list' && setting.listType === 'composite')
        if(!isComposite) setValue(newValue)
        updateCallback(uuid, newValue)
    }

    const createSetting = (settingKey: string, setting: Setting_t, value, keyPrefix = '', onChange = updateSetting) => {
        const key = `${keyPrefix}-${settingKey}`
        value = value ?? setting.value

        switch(setting.kind) {
            case 'string':
                return (<StringPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />)
            case 'boolean':
                return (<BoolPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />)
            case 'int':
                return (<IntPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} min={setting.min} max={setting.max} />)
            case 'float':
                return (<FloatPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} min={setting.min} max={setting.max} />)
            case 'path':
                return (<PathPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />)
            case 'dropdown':
                return (<DropDownPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} options={setting.options} />)
            case 'composite':
                return (<CompositePreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} createPrefComponent={createSetting} />)
            case 'list':
                return (<ListPreference id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} listType={setting.listType} onChange={onChange} createPrefComponent={createSetting} />)
        }
    }

    return (
        <PreferenceEntry>
            {createSetting(settingKey, setting, value)}
            <br/>
        </PreferenceEntry>
    )
}
