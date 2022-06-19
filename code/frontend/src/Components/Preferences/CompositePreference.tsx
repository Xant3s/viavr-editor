import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'

export const CompositePreference = ({id, label, value, onChange, createPrefComponent}) => {
    return (
        <>
            <h5>{label}</h5>
            {
                <PreferenceListEntry>
                    <div>{
                        Object.entries(value)
                              .map(entry => createPrefComponent(entry[0], entry[1], id))
                    }</div>
                </PreferenceListEntry>
            }
        </>
    )
}
