import {StringPreference} from './StringPreference'

export const Preference = ({id, label, value, onChange}) => {
    return (
        <>
            <StringPreference id={id} label={label} value={value} onChange={onChange}/>
        </>
    )
}
