import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui'
import React, { useEffect, useState } from 'react'
import { Action, Parameter } from '../../../@types/Behaviors'
import { SettingAccordionAction } from '../../Settings/SettingAccordion'

interface Props {
    depth: number
    availableActions: Action[]
    sceneObjects: any[]
    component: any
    callback: any
    OnClose: any
}

const ActionComponent = (props: Props) => {
    const [options, setOptions] = useState(props.availableActions.map(action => ({ label: action.displayName, value: action.name })))
    const [action, setAction] = useState<Action>()


    function updateAction(actionName: string) {
        const action = props.availableActions.find(action => (action.name === actionName))
        setAction(action)
        props.callback(props.component, action)
    }

    function updateParameter(param: Parameter, value: string) {
        if (action !== undefined) {
            const parameter = action.parameters.find(parameter => parameter.name === param.name)
            if (parameter !== undefined) {
                parameter.value = value
            }
        }
        props.callback(props.component, action)
    }

    useEffect(() => {
        setOptions(props.availableActions.map(action => ({ label: action.name, value: action.name })))
    }, [props.availableActions])

    useEffect(() => {
        // initial load
        const newAction = props.availableActions.find(action => (action.name === props.component.name));
        if (newAction) {
            newAction.parameters = props.component.parameters
            setAction(newAction)
        }

    }, [props.availableActions, props.component.name, props.component.parameters])

    return (
        <SettingAccordionAction
            summary={<div style={{ alignItems: 'center', display: 'flex' }}>
                <DragHandleVerticalIcon style={{ marginRight: '5px' }}></DragHandleVerticalIcon>
                Action Component
            </div>}
            onClose={() => props.OnClose()}
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
                        selected={action?.displayName}
                        onSelect={item => updateAction(item.value as string)}
                        onDeselect={_ => updateAction('')}
                    >
                        <Button>{action?.displayName || 'Select action...'}</Button>
                    </SelectMenu>
                    {action?.parameters?.map((parameter, index) => (
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
