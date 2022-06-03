import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'
import {DropDownPreference} from './DropDownPreference'

type Kind = 'path' | 'string' | 'dropdown'
const noOP = () => {}
const emptyList: string[] = []

export const Preference = ({id, label, value, onChange, kind = 'string', selectPath = noOP, options = emptyList}) => {
    const getPreference = (kind: Kind) => {
        switch(kind) {
            case 'path':
                return PathPreference({id, label, value, onChange, selectPath})
            case 'dropdown':
                return DropDownPreference({id, label, value, onChange, options})
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
