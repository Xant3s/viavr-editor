import { SettingListEntry } from '../StyledComponents/Preferences/StyledSettings'
import { Setting_t, value_t } from '../../@types/Settings'

export declare interface CompositePreferenceProps {
    id: string,
    uuid: string | undefined,
    label: string | undefined,
    value: { [key: string]: Setting_t },
    onChange: (uuid: string, newValue: value_t) => void,
    createPrefComponent: any
}

export const CompositeSetting = ({
                                     id,
                                     uuid,
                                     label,
                                     value,
                                     onChange,
                                     createPrefComponent,
                                 }: CompositePreferenceProps) => {
    const drawEntry = ([settingName, setting]: [string, Setting_t]) => {
        const key = `${id}-${settingName}`
        return (
            <div key={key} style={{ marginBottom: 5 }}>
                {createPrefComponent(settingName, setting, undefined, id, onChange)}
            </div>
        )
    }

    return (
        <>
            {label && <h5>{label}</h5>}
            <SettingListEntry>
                <div>
                    {
                        Object.entries(value)
                            .map(entry => drawEntry(entry))
                    }
                </div>
            </SettingListEntry>
        </>
    )
}
