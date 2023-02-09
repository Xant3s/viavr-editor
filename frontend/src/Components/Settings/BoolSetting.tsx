import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { Checkbox } from 'evergreen-ui'

export const BoolSetting = ({ id, uuid, label, value, onChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <Checkbox id={id}
                      checked={value === 'true'}
                      onChange={(e) => onChange(uuid, e.target.checked.toString())}
                      style={{ margin: 0 }}
            />
        </div>
    )
}
