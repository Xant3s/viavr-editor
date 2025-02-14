import { Button, SelectMenu } from 'evergreen-ui'
import { SettingEntryLabel } from '../StyledComponents/Preferences/StyledSettings'
import { useEffect, useState } from 'react';

export const VariableDropDownSetting = ({ id, uuid, label, value, onChange }) => {
    const [variables, setVariables] = useState<object[]>([])
    const [options, setOptions] = useState(variables.map(variable => ({ label: variable["name"], value: variable["name"] })))
    const [selected, setSelected] = useState<string>("")

    const loadVariables = async () => {
        const loadedVariables = await api.invoke(api.channels.toMain.getBuildSetting, 'variables');
        setVariables(loadedVariables || [])
    }

    useEffect(() => {
        loadVariables()
        updateOptions()
    })

    function updateOptions() {
        setOptions(variables.map(variable => ({ label: variable["name"], value: variable["name"] })))
    }

    const onSelect = (item) => {
        setSelected(item)
        onChange(uuid, item)
    }

    return (
        <>
            {label && <SettingEntryLabel htmlFor={id}>{label}:</SettingEntryLabel>}
            {/* <Select id={id} name={id} value={value} height={24} onChange={(e) => onChange(uuid, e.target.value)} onClick={loadVariables}>
                {
                    variables.map((variable) => {
                        return <option key={variable["name"]} value={variable["name"]}>{variable["name"]}</option>
                    })
                }
            </Select> */}
            <SelectMenu
                title="Select name"
                hasFilter={false}
                hasTitle={false}
                options={options}
                selected={selected}
                onSelect={(item) => onSelect(item.value)}
            >
                <Button>{selected || 'Select variable...'}</Button>
            </SelectMenu>
        </>
    )
}
