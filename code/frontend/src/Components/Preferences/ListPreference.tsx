import {Button} from '../StyledComponents/Button'
import {RemoveButton} from '../StyledComponents/RemoveButton'
import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'
import { StringPreference } from './StringPreference'
import {FloatPreference, IntPreference} from './NumberPreference'
import {CompositePreference} from './CompositePreference'


export const ListPreference = ({id, uuid, label, value, listType, onChange, createPrefComponent}) => {
    const createListEntry = (listIndex: number, value) => {
        switch(listType) {
            case 'string':
                return <StringPreference id={`${id}-${listIndex}`} uuid={`${uuid}-${listIndex}`} label={undefined} value={value} onChange={onChange} />
            case 'int':
                return <IntPreference id={`${id}-${listIndex}`} uuid={`${uuid}-${listIndex}`} label={undefined} value={value} onChange={onChange} min={undefined} max={undefined} />
            case 'float':
                return <FloatPreference id={`${id}-${listIndex}`} uuid={`${uuid}-${listIndex}`} label={undefined} value={value} onChange={onChange} min={undefined} max={undefined} />
            case 'composite':
                return <CompositePreference id={`${id}-${listIndex}`} uuid={`${uuid}-${listIndex}`} label={undefined} value={value} onChange={onChange} createPrefComponent={createPrefComponent} />
        }
    }

    const addListItem = () => {
        const newValue = [...value]
        if(newValue.length === 0) {
            console.error('ListPreference: Cannot add item to empty list')
        }
        newValue.push(JSON.parse(JSON.stringify(newValue[newValue.length - 1])))
        onChange(uuid, newValue)
    }

    const removeListItem = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(uuid, newValue)
    }

    return (
        <>
            <h5>{label}</h5>
            <div style={{background: '#4d535b'}}>
            {
                value.map((item, index) => (
                    <PreferenceListEntry key={index} style={{marginBottom: '0', marginTop: '0'}}>
                        <div>{createListEntry(index, item)}</div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <RemoveButton onClick={() => removeListItem(index)}/>
                        </div>
                    </PreferenceListEntry>
                ))
            }
            <Button id={`btn-add-${id}`} onClick={addListItem} style={{marginLeft: 20}}>Add</Button>
            </div>
        </>
    )
}
