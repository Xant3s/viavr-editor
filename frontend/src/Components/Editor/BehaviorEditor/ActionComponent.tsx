import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui'
import React, { useEffect, useState } from 'react'
import { Action, Parameter } from '../../../@types/Behaviors'
import { SettingAccordionAction } from '../../Settings/SettingAccordion'

interface Props {
    action: Action | undefined
    availableActions: Action[]
    sceneObjects: any[]
    updateAction: (newAction: Action | undefined) => void
    deleteActionComponent: () => void
}

const ActionComponent = (props: Props) => {
    const [options, setOptions] = useState(props.availableActions.map(action => ({ label: action.displayName, value: action.name })))


    function selectAction(actionName: string) {
        const action = props.availableActions.find(action => (action.name === actionName))
        console.log(`select action ${actionName}`, props.action === undefined, action === undefined)
        props.updateAction(action)
    }

    function updateParameter(param: Parameter, value: string) {
        if(props.action === undefined) return
        const newAction = props.action
        const parameter = newAction.parameters.find(parameter => parameter.name === param.name)
        if(parameter !== undefined) {
            parameter.value = value
        }
        props.updateAction(newAction)
    }

    useEffect(() => {
        setOptions(props.availableActions.map(action => ({ label: action.name, value: action.name })))
    }, [props.availableActions])

    
    return (
        <SettingAccordionAction
            summary={<div style={{ alignItems: 'center', display: 'flex' }}>
                <DragHandleVerticalIcon style={{ marginRight: '5px' }}></DragHandleVerticalIcon>
                Action Component
            </div>}
            onClose={() => props.deleteActionComponent()}
            details={
                <Pane
                    padding={20}
                    border="hidden"
                    //borderRadius={8}
                    //boxShadow="0 1px 2px rgba(67, 90, 111, 0.1), 0 2px 4px rgba(67, 90, 111, 0.1)"
                    marginBottom={20}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <SelectMenu
                        title='Select action'
                        options={options}
                        selected={props.action?.displayName}
                        onSelect={item => selectAction(item.value as string)}
                        onDeselect={_ => selectAction('')}
                    >
                        <Button>{props.action?.displayName || 'Select action...'}</Button>
                    </SelectMenu>
                    {props.action?.parameters?.map((parameter, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }} >
                            <div style={{ textAlign: 'left', float: 'left', marginLeft: '15px', width: '180px' }}>
                                <p>
                                    {parameter["name"]}
                                </p>
                            </div>
                            {parameter["name"] === 'gameObject' || parameter["name"] === 'other' ? (
                                <div>
                                    <Select value={parameter.value} onChange={e => updateParameter(parameter, e.target.value)} required>
                                        {props.sceneObjects.map((object, index) => (
                                            <option key={index} value={object.uuid}>
                                                {object.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            ) : (parameter["name"] === 'tag' ? (
                                <div>
                                    <Select
                                        value={parameter.value} onChange={e => updateParameter(parameter, e.target.value)} required>
                                        {options.map((object, index) => (
                                            <option key={index} value={object.value}>
                                                {object.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            ) :
                                // Render text input for other parameters
                                <TextInput
                                    width={'60%'}
                                    type="text"
                                    placeholder="Parameter Value"
                                    value={parameter["value"]}
                                    onChange={(e) => updateParameter(parameter, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </Pane>
            }
        />
    )
}

export default ActionComponent
