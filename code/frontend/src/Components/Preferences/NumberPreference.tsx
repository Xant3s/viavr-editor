import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const IntPreference = ({id, label, value, onChange, min=undefined, max=undefined}) => {
    return (
        <NumberPreference id={id} label={label} value={value} onChange={onChange} step={1} min={min} max={max}/>
    )
}

export const FloatPreference = ({id, label, value, onChange, min=undefined, max=undefined}) => {
    return (
        <NumberPreference id={id} label={label} value={value} onChange={onChange} step={0.1} min={min} max={max}/>
    )
}

const NumberPreference = ({id, label, value, onChange, step, min=undefined, max=undefined}) => {
    return (
        <>
            {label && <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>}
            <input id={id} type="number" step={step} min={min} max={max} value={value} onChange={(e) => onChange(e.target.value.toString())}/>
        </>
    )
}
