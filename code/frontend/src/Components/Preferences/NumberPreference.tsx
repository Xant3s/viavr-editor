import {PreferenceEntryLabel} from '../StyledComponents/Preferences/StyledPreferences'

export const IntPreference = ({id, uuid, label, value, onChange, min, max}) => {
    return (
        <NumberPreference id={id} uuid={uuid} label={label} value={value} onChange={onChange} step={1} min={min} max={max}/>
    )
}

export const FloatPreference = ({id, uuid, label, value, onChange, min, max}) => {
    return (
        <NumberPreference id={id} uuid={uuid} label={label} value={value} onChange={onChange} step={0.1} min={min} max={max}/>
    )
}

const NumberPreference = ({id, uuid, label, value, onChange, step, min=undefined, max=undefined}) => {
    return (
        <>
            {label && <PreferenceEntryLabel htmlFor={id}>{label}:</PreferenceEntryLabel>}
            <input id={id} type="number" step={step} min={min} max={max} value={value} onChange={(e) => onChange(uuid, e.target.value.toString())}/>
        </>
    )
}
