import {PreferenceListEntry} from '../StyledComponents/Preferences/StyledPreferences'
import {Setting_t, value_t} from '../../@types/Settings'

export declare interface CompositePreferenceProps {
    id: string,
    uuid: string | undefined,
    label: string | undefined,
    value: { [key: string]: Setting_t },
    onChange: (uuid: string, newValue: value_t) => void,
    createPrefComponent: (settingKey: string, setting: Setting_t, value: value_t | undefined, keyPrefix?: string) => JSX.Element
}

export const CompositePreference = ({id, uuid, label, value, onChange, createPrefComponent}: CompositePreferenceProps) => {
    const drawEntry = ([settingName, setting]: [string, Setting_t]) => {
        const key = `${id}-${settingName}`
        return (
            <div key={key}>
                {createPrefComponent(settingName, setting, undefined, id)}
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
