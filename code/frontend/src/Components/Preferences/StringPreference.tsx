import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const StringPreference = ({id, label, value, onChange}) => {
    return (
        <>
            <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>
            <input id={id} type="text" value={value} onChange={onChange}/>
        </>
    )
}
