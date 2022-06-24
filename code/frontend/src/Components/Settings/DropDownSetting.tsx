import {SettingEntryLabel} from '../StyledComponents/Preferences/StyledSettings'

export const DropDownSetting = ({id, uuid, label, value, onChange, options}) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <select id={id} name={id} value={value} onChange={(e) => onChange(uuid, e.target.value)}>
                {
                    options.map((option) => {
                        return <option key={option} value={option}>{option}</option>
                    })
                }
            </select>
        </>
    )
}
