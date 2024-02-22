import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Checkbox, Select, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Tooltip} from 'react-tooltip'

export const VariableEditor = () => {
    const [variables, setVariables] = useState<string[][]>([])

    const variablesTip = "Variables can be used for actions and events. They can store data, like numbers, text, or yes/no-values."

    const tableRowStyle = {
        backgroundColor: '#4D535B',
        color: '#4D535B',
        borderColor:'#6C737A' 
    };
    const tableHeaderStyle ={
        backgroundColor: '#6C737A',
        color:'white',
        borderColor:'#6C737A',
    };

    

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
            summary={
                <div style={{display:'flex', alignItems:'center'}}>
                    <p style={{margin:'0px', padding:'0px'}}>Variables</p>
                    <HelpOutlineIcon data-tooltip-id="Variables" data-tooltip-content={variablesTip} style={{ marginLeft: 5, fontSize: 14 }}/>
                    <Tooltip id="Variables" place="right" style={{fontSize: '14px'}} />
                </div>
            }
            details={
                <div>
                    <Table style={{borderColor:'#6C737A'}}>
                        <Table.Head style={tableHeaderStyle}>
                            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Type</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Default Value</Table.TextHeaderCell>
                            <Table.TextHeaderCell maxWidth={'150px'}> </Table.TextHeaderCell>
                        </Table.Head>
                        {variables.length===0 && 
                        <div>
                            <p style={{color:'#BCBEC1'}}> 
                                Add a Variable using the Add Variable Button.<br></br>
                                {variablesTip}
                            </p>
                        </div>
                        }
                        <Table.Body maxHeight={'200px'} minWidth={'600px'}>
                            {variables.map(([name, type, value], index) => (
                                <Table.Row key={index} style={tableRowStyle}>
                                    <Table.TextCell>
                                        <TextInput
                                            name="text-input-name"
                                            placeholder="Please enter a name"
                                            style={{width:'90%'}}
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
                                        <Select name="select-type" style={{width:'80%'}} value={type} onChange={e => {
                                            setVariables([
                                                ...variables.slice(0, index),
                                                [name, e.target.value, e.target.value==='boolean'?'true':''],
                                                ...variables.slice(index + 1),
                                            ])
                                            updateBuildSettings()
                                        }} required>
                                            <option key={0} value={"number"}>
                                                {"Number"}
                                            </option>
                                            <option key={1} value={"string"}>
                                                {"Text"}
                                            </option>
                                            <option key={2} value={"boolean"}>
                                                {"Yes/No Value"}
                                            </option>
                                        </Select>
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {(type === 'number' || type === 'string') && (
                                            <TextInput
                                                name="text-input-name"
                                                placeholder="Please enter a value"
                                                value={value}
                                                style={{width:'90%'}}
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
                                            
                                            <Select style={{width:'90%' }} name="select-type" value={value} onChange={e => {
                                                setVariables([
                                                ...variables.slice(0, index),
                                                [name, type, e.target.value],
                                                ...variables.slice(index + 1),
                                                ])
                                                updateBuildSettings()
                                                }} required>
                                                <option key={0} value="true">{"Yes"}</option>
                                                <option key={1} value="false">{"No"}</option>
                                            </Select>
                                        )}
                                    </Table.TextCell>
                                    <Table.TextCell minWidth={'10px'} maxWidth={'120px'}>
                                        <Button
                                            iconBefore={TrashIcon}
                                            appearance="Minimal"
                                            intent="none"
                                            onClick={() => deleteVariable(index)}
                                            style={{color:'white', backgroundColor:'#4D535B'}}                            
                                        >
                                            Delete
                                        </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <Button appearance="primary" onClick={() => {
                            setVariables([...variables, ['', 'number']])
                            updateBuildSettings()
                        }}>
                            Add Variable
                        </Button>
                    </div>
                </div>
            }
        />
    )
}
