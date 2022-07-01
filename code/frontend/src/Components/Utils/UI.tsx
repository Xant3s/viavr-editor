import {Checkbox as EvergreenCheckbox} from 'evergreen-ui'

export const Checkbox = ({id, checked, onChange, label, title=undefined, disabled=undefined}: any ) => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <EvergreenCheckbox id={id} title={title} checked={checked} onChange={onChange} disabled={disabled} style={{margin: 3}} />
            <label htmlFor={id} style={{marginLeft: 5}} >{label}</label>
        </div>
    )
}
