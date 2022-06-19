import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'
import {DropDownPreference} from './DropDownPreference'
import {ListPreference} from './ListPreference'
import {PreferenceEntry} from '../StyledComponents/Preferences/StyledPreferences'
import {BoolPreference} from './BoolPreference'
import {IntPreference} from './NumberPreference'

type Kind = 'string' | 'boolean' | 'int' | 'float' | 'path' | 'dropdown' | 'list'
const noOP = () => {}
const emptyList: string[] = []

export const Preference = ({id, label, value, onChange, kind = 'string', selectPath = noOP, options = emptyList, createPrefComponent}) => {
    const getPreference = (kind: Kind) => {
        switch(kind) {
            case 'boolean':
                return BoolPreference({id, label, value, onChange})
            case 'int':
                return IntPreference({id, label, value, onChange})
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
        <PreferenceEntry>
            {getPreference(kind as Kind)}
            <br/>
        </PreferenceEntry>
    )
}
