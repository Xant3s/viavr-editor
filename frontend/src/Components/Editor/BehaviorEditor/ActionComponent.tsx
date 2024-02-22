import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import { Action } from '../../../@types/Behaviors';
import { SettingAccordion, SettingAccordionAction } from '../../Settings/SettingAccordion'
import { actions } from './EventsEditor';

const ActionComponent = (props) => {
    const [options, setOptions] = useState(actions.map(action => ({ label: action.displayName, value: action.name })))
    const [action, setAction] = useState<Action>();
    const [actionButtonText, setActionButtonText] = useState<string>('')
    const [selectedObject, setSelectedObject] = useState<any>({})
    const [selectedTag, setSelectedTag] = useState<any>({})

    useEffect(() => {
        updateOptions()
    })

    function updateOptions() {
        setOptions(actions.map(action => ({ label: action.name, value: action.name })))
    }

    function setActionAndText(actionName) {
        const action = actions.find(action => (action.name === actionName))
        setAction(action)
        setActionButtonText(actionName);
        props.callback(props.component, action)
    }

    function updateParameter(param, value) {
        if (action !== undefined) {
            const parameter = action.parameters.find(parameter => parameter.name === param.name);
            if (parameter !== undefined) {
                parameter.value = value
            }
        }
        props.callback(props.component, action)
    }

    return (
        <SettingAccordionAction
            summary={<div style={{alignItems:'center', display:'flex'}}>
                <DragHandleVerticalIcon style={{marginRight:'5px'}}></DragHandleVerticalIcon>
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
                        onSelect={item => {
                            setActionAndText(item.value)
                        }}
                        onDeselect={_ => { setActionAndText("") }}
                    >
                        <Button>{actionButtonText || 'Select action...'}</Button>
                    </SelectMenu>
                    {action?.parameters?.map((parameter, index) => (
                                    <div key={index} style={{display:'flex', alignItems:'center'}} >
                                    <div style={{textAlign:'left' ,float:'left', marginLeft:'15px', width:'180px'}}>
                                        <p>
                                            {parameter["name"]}
                                        </p>
                                    </div>
                                    {parameter["name"] === 'gameObject' || parameter["name"]=== 'other' ? (
                                    // Render a slider with gameObject's from the scene for 'gameObject' parameters
                                    <div>
                                        <Select value={selectedObject.name} onChange={e => updateParameter(parameter, e.target.value)} required>
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
                                            value={selectedTag.name} onChange={e => updateParameter(parameter, e.target.value)} required>
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
    );
};

export default ActionComponent;
