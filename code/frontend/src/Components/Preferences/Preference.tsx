import {StringPreference} from './StringPreference'
import {PathPreference} from './PathPreference'
import {DropDownPreference} from './DropDownPreference'
import {ListPreference} from './ListPreference'
import {PreferenceEntry} from '../StyledComponents/Preferences/StyledPreferences'
import {BoolPreference} from './BoolPreference'
import {FloatPreference, IntPreference} from './NumberPreference'
import { CompositePreference } from './CompositePreference'

type Kind = 'string' | 'boolean' | 'int' | 'float' | 'path' | 'dropdown' | 'composite' | 'list'
const emptyList: string[] = []

export const Preference = ({id, label, value, onChange, kind = 'string', options = emptyList, min=undefined, max=undefined, createPrefComponent}) => {
    const getPreference = (kind: Kind) => {
        switch(kind) {
            case 'boolean':
                return BoolPreference({id, label, value, onChange})
            case 'int':
                return IntPreference({id, label, value, onChange, min, max})
            case 'float':
                return FloatPreference({id, label, value, onChange, min, max})
            case 'path':
                return PathPreference({id, label, value, onChange})
            case 'dropdown':
                return DropDownPreference({id, label, value, onChange, options})
            case 'composite':
                return CompositePreference({id, label, value, onChange, createPrefComponent})
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
