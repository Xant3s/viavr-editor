import {Select} from 'evergreen-ui'
import {SettingEntryLabel} from '../StyledComponents/Preferences/StyledSettings'

export const DropDownSetting = ({id, uuid, label, value, onChange, options}) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <Select id={id} name={id} value={value} height={24} onChange={(e) => onChange(uuid, e.target.value)}>
                {
                    options.map((option) => {
                        return <option key={option} value={option}>{option}</option>
                    })
                }
            </Select>
        </>
    )
}
