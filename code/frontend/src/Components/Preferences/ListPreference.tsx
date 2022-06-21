import {Button} from '../StyledComponents/Button'
import {RemoveButton} from '../StyledComponents/RemoveButton'
import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'
import { StringPreference } from './StringPreference'


export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    const removeListItem = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    const addListItem = () => {
        const newValue = [...value]
        if(newValue.length === 0) {
            console.error('ListPreference: Cannot add item to empty list')
        }
        newValue.push(JSON.parse(JSON.stringify(newValue[newValue.length - 1])))
        onChange(newValue)
    }

    return (
        <>
            <h5>{label}</h5>
            {
                value.map((item, index) => (
                    <PreferenceListEntry key={index}>
                        <div>{
                            <StringPreference id={`${id}-${index}`} label={undefined} value={item} onChange={() =>{}} />
                            // Object.entries(item)
                            //       .map(entry => createPrefComponent(entry[0], entry[1], id, index))
                        }</div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <RemoveButton onClick={() => removeListItem(index)}/>
                        </div>
                    </PreferenceListEntry>
                ))
            }

            <Button id={`btn-add-${id}`} onClick={addListItem} style={{marginLeft: 10}}>Add</Button>
        </>
    )
}
