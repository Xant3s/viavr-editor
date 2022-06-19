import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const BoolPreference = ({id, label, value, onChange}) => {
    return (
        <>
            <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>
            <input id={id} type="checkbox" checked={value === 'true'} onChange={(e) => {
                console.log(e.target.value)
                onChange(e.target.checked)
            }}/>
        </>
    )
}
