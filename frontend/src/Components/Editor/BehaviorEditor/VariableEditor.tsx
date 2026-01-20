import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip } from 'react-tooltip'
import { Variable } from '../../../@types/Behaviors'
import { useTranslation } from '../../../LocalizationContext'

export const VariableEditor = ({ isActive }) => {
    const { translate } = useTranslation()
    const [variables, setVariables] = useState<Variable[]>([])

    const variablesTip = translate('var_editor_variables_tip')

    const tableRowStyle = {
        backgroundColor: '#4D535B',
        color: '#4D535B',
        borderColor: '#6C737A',
    }
    const tableHeaderStyle = {
        backgroundColor: '#6C737A',
        color: 'white',
        borderColor: '#6C737A',
    }

    // TODO: update build settings onLeaveFocus

    const deleteVariable = async (index: number) => {
        const updatedVariables = variables.filter((_, i) => i !== index)
        setVariables(updatedVariables)
        await updateBuildSettings()
    }

    const updateBuildSettings = async () => {
        await api.invoke(api.channels.toMain.setBuildSetting, 'variables', variables)
    }

    const loadVariables = async () => {
        const loadedVariableObjects = await api.invoke(api.channels.toMain.getBuildSetting, 'variables') ?? []
        setVariables(loadedVariableObjects)
    }

    useEffect(() => {
        if (isActive) {
            loadVariables()
        }
    }, [isActive])

    return (
        <SettingAccordion
            summary={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ margin: '0px', padding: '0px' }}>{translate('var_editor_summary_variables')}</span>
                    <HelpOutlineIcon data-tooltip-id="Variables" data-tooltip-content={variablesTip} style={{ marginLeft: 5, fontSize: 14 }} />
                    <Tooltip id="Variables" place="right" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
                </span>
            }
            details={
                <div>
                    <Table style={{ borderColor: '#6C737A' }}>
                        <Table.Head style={tableHeaderStyle}>
                            <Table.TextHeaderCell>{translate('var_editor_table_header_name')}</Table.TextHeaderCell>
                            <Table.TextHeaderCell>{translate('var_editor_table_header_type')}</Table.TextHeaderCell>
                            <Table.TextHeaderCell>{translate('var_editor_table_header_default_value')}</Table.TextHeaderCell>
                            <Table.TextHeaderCell maxWidth={'150px'}> </Table.TextHeaderCell>
                        </Table.Head>
                        {variables.length === 0 &&
                            <div>
                                <p style={{ color: '#BCBEC1' }}>
                                    {translate('var_editor_no_variables_info')}<br></br>
                                    {variablesTip}
                                </p>
                            </div>
                        }
                        <Table.Body maxHeight={'200px'} minWidth={'600px'}>
                            {variables.map(({ name, type, value }, index) => (
                                <Table.Row key={index} style={tableRowStyle}>
                                    <Table.TextCell>
                                        <TextInput
                                            name="text-input-name"
                                            placeholder={translate('var_editor_placeholder_enter_name')}
                                            style={{ width: '90%' }}
                                            value={name}
                                            onChange={async e => {
                                                setVariables([
                                                    ...variables.slice(0, index),
                                                    { name: e.target.value, type: type, value: value },
                                                    ...variables.slice(index + 1),
                                                ])
                                                await updateBuildSettings()
                                            }}
                                        />
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <Select name="select-type" style={{ width: '80%' }} value={type} onChange={async e => {
                                            setVariables([
                                                ...variables.slice(0, index),
                                                { name: name, type: e.target.value, value: e.target.value === 'boolean' ? 'true' : '' },
                                                ...variables.slice(index + 1),
                                            ])
                                            await updateBuildSettings()
                                        }} required>
                                            <option key={0} value={"number"}>
                                                {translate('var_editor_select_number')}
                                            </option>
                                            <option key={1} value={"string"}>
                                                {translate('var_editor_select_text')}
                                            </option>
                                            <option key={2} value={"boolean"}>
                                                {translate('var_editor_select_boolean')}
                                            </option>
                                        </Select>
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {(type === 'number' || type === 'string') && (
                                            <TextInput
                                                name="text-input-name"
                                                placeholder={translate('var_editor_placeholder_enter_value')}
                                                value={value}
                                                style={{ width: '90%' }}
                                                onChange={async e => {
                                                    setVariables([
                                                        ...variables.slice(0, index),
                                                        { name: name, type: type, value: e.target.value },
                                                        ...variables.slice(index + 1),
                                                    ])
                                                    await updateBuildSettings()
                                                }}
                                            />
                                        )}
                                        {type === 'boolean' && (

                                            <Select style={{ width: '90%' }} name="select-type" value={value} onChange={async e => {
                                                setVariables([
                                                    ...variables.slice(0, index),
                                                    { name: name, type: type, value: e.target.value },
                                                    ...variables.slice(index + 1),
                                                ])
                                                await updateBuildSettings()
                                            }} required>
                                                <option key={0} value="true">{translate('var_editor_select_yes')}</option>
                                                <option key={1} value="false">{translate('var_editor_select_no')}</option>
                                            </Select>
                                        )}
                                    </Table.TextCell>
                                    <Table.TextCell minWidth={'10px'} maxWidth={'120px'}>
                                        <Button
                                            iconBefore={TrashIcon}
                                            appearance="Minimal"
                                            intent="none"
                                            onClick={() => deleteVariable(index)}
                                            style={{ color: 'white', backgroundColor: '#4D535B' }}
                                        >
                                            {translate('var_editor_delete')}
                                        </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <Button appearance="primary" onClick={async () => {
                            setVariables([...variables, { name: '', type: 'number', value: '0' }])
                            await updateBuildSettings()
                        }}>
                            {translate('var_editor_add_variable')}
                        </Button>
                    </div>
                </div>
            }
        />
    )
}
