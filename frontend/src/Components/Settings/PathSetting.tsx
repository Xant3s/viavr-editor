import { FilePicker } from 'evergreen-ui'
import {SettingEntryLabel} from '../StyledComponents/Preferences/StyledSettings'

export const PathSetting = ({id, uuid, label, value, onChange}) => {
    return <div style={{display: 'flex', alignItems: 'center'}}>
        {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
        <FilePicker id={id}
                    width={350}
                    height={24}
                    onChange={(e) => onChange(uuid, e[0]['path'])}
                    placeholder={value || 'Select a file'}
        />
    </div>
}
