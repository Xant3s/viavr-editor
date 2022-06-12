import {FaTimes} from 'react-icons/fa'

export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    const removeListItem = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange({target: {value: newValue}})
    }

    const addListItem = () => {
        const newValue = [...value]
        if(newValue.length === 0) {
            console.error('ListPreference: Cannot add item to empty list')
        }
        newValue.push(value[value.length - 1])
        onChange({target: {value: newValue}})
    }

    return (
        <>
            <h5>{label}</h5>
            {
                value.map((item, index) => (
                    <div className={'preference-list-entry'} key={index}>
                        <div>{
                            Object.entries(item)
                                  .map(entry => createPrefComponent(entry[0], entry[1], id, index))
                        }</div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <FaTimes onClick={() => removeListItem(index)} className={'btn-remove'}/>
                        </div>
                    </div>
                ))
            }

            <button id={`btn-add-${id}`} className={'btn'} onClick={addListItem} style={{marginLeft: 10}}>Add</button>
        </>
    )
}
