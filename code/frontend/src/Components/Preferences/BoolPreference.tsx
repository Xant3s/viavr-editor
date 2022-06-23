import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const BoolPreference = ({id, uuid, label, value, onChange}) => {
    return (
        <>
            {label && <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>}
            <input id={id} type="checkbox" checked={value === 'true'} onChange={(e) => {
                onChange(uuid, e.target.checked.toString())
            }}/>
        </>
    )
}
