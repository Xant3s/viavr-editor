import { Button, Pane, SelectMenu, TextInput } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import { Action } from '../../../@types/Behaviors';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { actions } from './EventsEditor';

const ActionComponent = (props) => {
    const [options, setOptions] = useState(actions.map(action => ({ label: action.name, value: action.name })))
    const [action, setAction] = useState<Action>();
    const [actionButtonText, setActionButtonText] = useState<string>('')

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
        <SettingAccordion
            summary={'Action Component'}
            details={
                <Pane
                    padding={20}
                    border="default"
                    borderRadius={8}
                    boxShadow="0 1px 2px rgba(67, 90, 111, 0.1), 0 2px 4px rgba(67, 90, 111, 0.1)"
                    marginBottom={20}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <SelectMenu
                        title='Select action'
                        options={options}
                        selected={action?.name}
                        onSelect={item => {
                            setActionAndText(item.value)
                        }}
                        onDeselect={_ => { setActionAndText("") }}
                    >
                        <Button>{actionButtonText || 'Select action...'}</Button>
                    </SelectMenu>
                    {action?.parameters?.map((parameter, index) => (
                        <div key={index}>
                            <p>
                                {parameter["name"]} ({parameter["type"]})
                            </p>
                            <TextInput
                                type="text"
                                placeholder="Parameter Value"
                                // TODO depending on the parameter type this should vary. For bools add a checkmark instead
                                onChange={(e) => updateParameter(parameter, e.target.value)}
                            />
                        </div>
                    ))}
                </Pane>
            }
        />
    );
};

export default ActionComponent;
