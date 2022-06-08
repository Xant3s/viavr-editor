import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'
import {DropDownPreference} from './DropDownPreference'
import {ListPreference} from './ListPreference'

type Kind = 'path' | 'string' | 'dropdown' | 'list'
const noOP = () => {}
const emptyList: string[] = []

export const Preference = ({id, label, value, onChange, kind = 'string', selectPath = noOP, options = emptyList, createPrefComponent}) => {
    const getPreference = (kind: Kind) => {
        switch(kind) {
            case 'path':
                return PathPreference({id, label, value, onChange, selectPath})
            case 'dropdown':
                return DropDownPreference({id, label, value, onChange, options})
            case 'list':
                return ListPreference({id, label, value, onChange, createPrefComponent})
            case 'string':  // fallthrough
            default:
                return StringPreference({id, label, value, onChange})
        }
    }

    return (
        <div className="preference-entry">
            {getPreference(kind as Kind)}
            <br/>
        </div>
    )
}
