import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { TextInput } from 'evergreen-ui'

export const StringSetting = ({ id, uuid, label, value, onChange }) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <TextInput id={id} value={value} onChange={(e) => onChange(uuid, e.target.value)} height={24} />
        </>
    )
}
