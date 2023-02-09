import {useEffect, useState} from 'react'
import {StringSetting} from './StringSetting'
import {PathSetting} from './PathSetting'
import {DropDownSetting} from './DropDownSetting'
import {ListSetting} from './ListSetting'
import {SettingsEntry} from '../StyledComponents/Preferences/StyledSettings'
import {BoolSetting} from './BoolSetting'
import {FloatSetting, IntSetting} from './NumberPreference'
import { CompositeSetting } from './CompositeSetting'
import {Setting_t, value_t} from '../../@types/Settings'


// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Setting = ({settingKey, setting, updateCallback = (uuid: string, newValue: value_t) => {}}) => {
    const [value, setValue] = useState<value_t>()

    useEffect(() => {
        setValue(setting.value)
    }, [setting.value])

    const updateSetting = (uuid: string, newValue: value_t) => {
        const isComposite = setting.kind === 'composite' || (setting.kind === 'list' && setting.listType === 'composite')
        if(!isComposite) setValue(newValue)
        updateCallback(uuid, newValue)
    }

    const createSetting = (settingKey: string, setting: Setting_t, value, keyPrefix = '', onChange = updateSetting) => {
        const key = `${keyPrefix}-${settingKey}`
        value = value ?? setting.value

        switch(setting.kind) {
            case 'string':
                return <StringSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />
            case 'boolean':
                return <BoolSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />
            case 'int':
                return <IntSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} min={setting.min} max={setting.max} />
            case 'float':
                return <FloatSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} min={setting.min} max={setting.max} />
            case 'path':
                return <PathSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} />
            case 'dropdown':
                return <DropDownSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} options={setting.options} />
            case 'composite':
                return <CompositeSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} onChange={onChange} createPrefComponent={createSetting} />
            case 'list':
                return <ListSetting id={settingKey} uuid={setting.uuid} key={key} label={setting.label} value={value} listType={setting.listType} onChange={onChange} createPrefComponent={createSetting} />
        }
    }

    return (
        <SettingsEntry>
            {createSetting(settingKey, setting, value)}
        </SettingsEntry>
    )
}
