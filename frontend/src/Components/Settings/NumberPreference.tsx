import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'

export const IntSetting = ({ id, uuid, label, value, onChange, min, max }) => {
    return (
        <NumberSetting id={id} uuid={uuid} label={label} value={value} onChange={onChange} step={1} min={min}
                       max={max} />
    )
}

export const FloatSetting = ({ id, uuid, label, value, onChange, min, max }) => {
    return (
        <NumberSetting id={id} uuid={uuid} label={label} value={value} onChange={onChange} step={0.1} min={min}
                       max={max} />
    )
}

const NumberSetting = ({ id, uuid, label, value, onChange, step, min = undefined, max = undefined }) => {
    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            <input id={id} type='number' step={step} min={min} max={max} value={value}
                   onChange={(e) => onChange(uuid, e.target.value.toString())} />
        </>
    )
}
