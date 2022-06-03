import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'

type Kind = 'path' | 'string'
const noOP = () => {}

export const Preference = ({id, label, value, onChange, kind = 'string', selectPath = noOP}) => {
    const getPreference = (kind: Kind) => {
        switch(kind) {
            case 'path':
                return PathPreference({id, label, value, onChange, selectPath})
            case 'string':
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
