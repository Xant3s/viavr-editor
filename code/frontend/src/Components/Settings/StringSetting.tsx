import {SettingEntryLabel} from '../StyledComponents/Preferences/StyledSettings'

export const StringSetting = ({id, uuid, label, value, onChange}) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <input id={id} type="text" value={value} onChange={(e) => onChange(uuid, e.target.value)}/>
        </>
    )
}
