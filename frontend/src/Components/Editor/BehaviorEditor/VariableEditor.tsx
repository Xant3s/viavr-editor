import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Checkbox, Select, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { useState } from 'react'

export const VariableEditor = () => {
    const [variables, setVariables] = useState<string[][]>([])

    // TODO: update build settings onLeaveFocus

    const deleteVariable = (index: number) => {
        const lhs = variables.slice(0, index)
        const rhs = variables.slice(index + 1)
        const newVariables = [...lhs, ...rhs]
        setVariables(newVariables)
        updateBuildSettings()
    }

    const updateBuildSettings = async () => {
        const variableObjects = variables.map(([name, type, value], index) => {
            const obj = {
                "name": name,
                "type": type,
                "value": value
            }
            return obj
        })
        await api.invoke(api.channels.toMain.setBuildSetting, 'variables', variableObjects)
    }

    return (
        <SettingAccordion
            summary={'Variables'}
            details={
                <div>
                    <Table>
                        <Table.Head>
                            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Type</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Default Value</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body height={240} minWidth={'600px'}>
                            {variables.map(([name, type, value], index) => (
                                <Table.Row key={index}>
                                    <Table.TextCell>
                                        <TextInput
                                            name="text-input-name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={e => {
                                                setVariables([
                                                    ...variables.slice(0, index),
                                                    [e.target.value, type, value],
                                                    ...variables.slice(index + 1),
                                                ])
                                                updateBuildSettings()
                                            }}
                                        />
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <Select style={{ backgroundColor: "white" }} name="select-type" value={type} onChange={e => {
                                            setVariables([
                                                ...variables.slice(0, index),
                                                [name, e.target.value, value],
                                                ...variables.slice(index + 1),
                                            ])
                                            updateBuildSettings()
                                        }} required>
                                            <option key={0} value={"number"}>
                                                {"Number"}
                                            </option>
                                            <option key={1} value={"string"}>
                                                {"String"}
                                            </option>
                                            <option key={2} value={"boolean"}>
                                                {"Boolean"}
                                            </option>
                                        </Select>
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {(type === 'number' || type === 'string') && (
                                            <TextInput
                                                name="text-input-name"
                                                placeholder="Default Value"
                                                value={value}
                                                onChange={e => {
                                                    setVariables([
                                                        ...variables.slice(0, index),
                                                        [name, type, e.target.value],
                                                        ...variables.slice(index + 1),
                                                    ])
                                                    updateBuildSettings()
                                                }}
                                            />
                                        )}
                                        {type === 'boolean' && (
                                            <input
                                                type="checkbox"
                                                value={value}
                                                onChange={e => {
                                                    setVariables([
                                                        ...variables.slice(0, index),
                                                        [name, type, e.target.checked.toString()],
                                                        ...variables.slice(index + 1),
                                                    ]);
                                                    updateBuildSettings()
                                                }}
                                            />
                                        )}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <Button
                                            iconBefore={TrashIcon}
                                            appearance="minimal"
                                            intent="danger"
                                            onClick={() => deleteVariable(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                        <Button appearance="primary" onClick={() => {
                            setVariables([...variables, ['', '']])
                            updateBuildSettings()
                        }}>
                            Add New
                        </Button>
                    </div>
                </div>
            }
        />
    )
}
