import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const IntPreference = ({id, label, value, onChange}) => {
    return (
        <>
            <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>
            <input id={id} type="number" step={1} value={value} onChange={(e) => onChange(e.target.value.toString())}/>
        </>
    )
}
