import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const StringPreference = ({id, uuid, label, value, onChange}) => {
    return (
        <>
            {label && <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>}
            <input id={id} type="text" value={value} onChange={(e) => onChange(uuid, e.target.value)}/>
        </>
    )
}
