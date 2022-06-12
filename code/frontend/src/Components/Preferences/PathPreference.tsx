import {StringPreference} from './StringPreference'

export const PathPreference = ({id, label, value, onChange, selectPath}) => {
    return (
        <>
            <StringPreference id={id} label={label} value={value} onChange={onChange}/>
            <button id={`btn-select-${id}`} className={'btn'} onClick={selectPath} style={{marginLeft: 10}}>Select</button>
        </>
    )
}
