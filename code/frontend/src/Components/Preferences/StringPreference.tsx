export const StringPreference = ({id, label, value, onChange}) => {
    return (
        <>
            <label htmlFor={id}>{label}:</label>
            <input id={id} type="text" value={value} onChange={onChange}/>
        </>
    )
}
