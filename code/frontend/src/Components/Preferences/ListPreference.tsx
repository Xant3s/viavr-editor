export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    return (
        <>
            {
                value.map(entry => Object.entries(entry)
                                         .map(entry => createPrefComponent(entry[0], entry[1])))
            }
            <button id={`btn-add-${id}`}>Add</button>
            <button id={`btn-remove-${id}`}>Remove</button>
        </>
    )
}
