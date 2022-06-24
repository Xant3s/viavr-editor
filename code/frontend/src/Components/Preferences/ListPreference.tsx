import {v4 as uuidv4} from 'uuid'
import {Button} from '../StyledComponents/Button'
import {RemoveButton} from '../StyledComponents/RemoveButton'
import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'
import { StringPreference } from './StringPreference'
import {FloatPreference, IntPreference} from './NumberPreference'
import {CompositePreference} from './CompositePreference'
import {value_t} from '../../@types/Settings'


export const ListPreference = ({id, uuid, label, value, listType, onChange, createPrefComponent}) => {
    const updateSetting = (listIndex: number, newValue: value_t, uuidOverride: string | undefined = undefined) => {
        // Composites use the uuid from the nested setting, other lists use the uuid from the list setting itself
        const id = uuidOverride !== undefined ? uuidOverride : uuid
        if(listType === 'composite') {
            onChange(id, newValue)
        } else {
            let newVal = [...value]
            newVal[listIndex] = newValue
            onChange(id, newVal)
        }
    }

    const createListEntry = (listIndex: number, value) => {
        switch(listType) {
            case 'string':
                return <StringPreference id={`${id}-${listIndex}`} uuid={undefined} label={undefined} value={value} onChange={(_, newValue) => updateSetting(listIndex, newValue)} />
            case 'int':
                return <IntPreference id={`${id}-${listIndex}`} uuid={undefined} label={undefined} value={value} onChange={(_, newValue) => updateSetting(listIndex, newValue)} min={undefined} max={undefined} />
            case 'float':
                return <FloatPreference id={`${id}-${listIndex}`} uuid={undefined} label={undefined} value={value} onChange={(_, newValue) => updateSetting(listIndex, newValue)} min={undefined} max={undefined} />
            case 'composite':
                return <CompositePreference id={`${id}-${listIndex}`} uuid={undefined} label={undefined} value={value} onChange={(uuid, newValue) => updateSetting(listIndex, newValue, uuid)} createPrefComponent={createPrefComponent} />
        }
    }

    const addListItem = () => {
        let newValue = [...value]
        if(listType === 'composite') {
            if(newValue.length === 0) {
                console.error('ListPreference: Cannot add item to empty list')
                return
            }
            let newEntry = cloneLastListEntry(newValue)
            newValue.push(newEntry)
        } else {
            newValue = [...value, ""]
        }
        onChange(uuid, newValue)
    }

    const removeListItem = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(uuid, newValue)
    }

    function cloneLastListEntry(newValue: any[]) {
        let newEntry = JSON.parse(JSON.stringify(newValue[newValue.length - 1]))
        Object.keys(newEntry).forEach(key => {
            newEntry[key].uuid = uuidv4()
        })
        return newEntry
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
