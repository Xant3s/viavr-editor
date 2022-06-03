export const Preference = ({id, label, value, onChange}) => {
    return (
        <div className="preference-entry">
            <label htmlFor={id}>{label}:</label>
            <input id={id} type="text" value={value} onChange={onChange}/>
            <br/>
        </div>
    )
}
