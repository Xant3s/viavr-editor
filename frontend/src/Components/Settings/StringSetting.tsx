import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { TextInput } from 'evergreen-ui'
import { useTranslation } from '../../LocalizationContext'

export const StringSetting = ({ id, uuid, label, value, onChange, required = false }) => {
    const { translate } = useTranslation()
    const isEmpty = required && (!value || value.trim() === '')

    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:{required && ' *'}</SettingEntryLabel>}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextInput
                    id={id}
                    value={value}
                    onChange={(e) => onChange(uuid, e.target.value)}
                    height={24}
                    isInvalid={isEmpty}
                />
                {isEmpty && (
                    <span style={{ color: '#d14343', fontSize: '12px', marginTop: '2px' }}>
                        {translate('prefs_field_required')}
                    </span>
                )}
            </div>
        </>
    )
}
