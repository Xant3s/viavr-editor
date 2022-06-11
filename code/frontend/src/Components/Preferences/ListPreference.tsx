import {FaTimes} from 'react-icons/fa'

export const ListPreference = ({id, label, value, onChange, createPrefComponent}) => {
    return (
        <>
            <h5>{label}</h5>
            {
                value.map((item, index) => (
                    <div className={'preference-list-entry'} key={index}>
                        <div>{
                            Object.entries(item)
                                  .map(entry => createPrefComponent(entry[0], entry[1], id, index))
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
