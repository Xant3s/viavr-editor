import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'

export const CompositePreference = ({id, label, value, onChange, createPrefComponent}) => {
    const drawEntry = (entry) => {
        return (
            <div>
                {createPrefComponent(entry[0], entry[1])}
            </div>
        )
    }

    return (
        <>
            {label && <h5>{label}</h5>}
            <PreferenceListEntry>
                <div>
                    {
                        Object.entries(value)
                              .map(entry => drawEntry(entry))
                    }
                </div>
            </PreferenceListEntry>
        </>
    )
}
