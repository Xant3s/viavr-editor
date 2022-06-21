import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const BoolPreference = ({id, label, value, onChange}) => {
    return (
        <>
            {label && <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>}
            <input id={id} type="checkbox" checked={value === 'true'} onChange={(e) => {
                onChange(e.target.checked.toString())
            }}/>
        </>
    )
}
