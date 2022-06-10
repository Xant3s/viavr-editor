export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    return (
        <>
            <h5>{label}</h5>
            <div style={{flexDirection: 'row', display: 'flex'}}>
                <div>
                    {
                        value.map(entry => Object.entries(entry)
                                                 .map(entry => createPrefComponent(entry[0], entry[1])))
                    }
                </div>
                <button id={`btn-remove-${id}`} style={{marginLeft: 10}}>Remove</button>
            </div>

            <button id={`btn-add-${id}`}>Add</button>
        </>
    )
}
