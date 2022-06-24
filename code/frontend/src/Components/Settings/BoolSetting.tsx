import {SettingEntryLabel} from '../StyledComponents/Preferences/StyledSettings'

export const BoolSetting = ({id, uuid, label, value, onChange}) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <input id={id} type="checkbox" checked={value === 'true'} onChange={(e) => {
                onChange(uuid, e.target.checked.toString())
            }}/>
        </>
    )
}
