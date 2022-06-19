import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const DropDownPreference = ({id, label, value, onChange, options}) => {
    return (
        <>
            <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>
            <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)}>
                {
                    options.map((option) => {
                        return <option key={option} value={option}>{option}</option>
                    })
                }
            </select>
        </>
    )
}
