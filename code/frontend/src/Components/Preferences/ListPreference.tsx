import {FaTimes} from 'react-icons/fa'

export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    return (
        <>
            <h5>{label}</h5>
                    {
                        value.map(entry => (
                            <div className={'preference-list-entry'}>
                                <div>{
                                    Object.entries(entry)
                                          .map(entry => createPrefComponent(entry[0], entry[1]))
                                }</div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <FaTimes onClick={() => {}} style={{color: 'black', cursor: 'pointer', marginLeft: 20}}/>
                                </div>
                            </div>
                        ))
                    }

            <button id={`btn-add-${id}`}>Add</button>
        </>
    )
}
