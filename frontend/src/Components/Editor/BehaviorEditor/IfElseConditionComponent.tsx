import React, { useState } from 'react';
import ActionSequence from './ActionSequence';
import { Button, Pane, SelectMenu, TextInput } from 'evergreen-ui';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import { use } from 'chai';
import { IfElse } from '../../../@types/Behaviors';

const IfElseConditionComponent = (props) => {
    const [variables, setVariables] = useState<{label: string; value: string;}[]>([]) 
    const [variableButtonText, setVariableButtonText] = useState<string>('')
    const [operators] = useState(["=", "!="].map(label => ({ label, value: label, }))) // TODO this is only for development purposes
    const [operatorButtonText, setOperatorButtonText] = useState<string>('')

    const [ifElse, setIfElse] = useState<IfElse>(new IfElse())

    async function loadVariables() {
        const result: string[][] = await api.invoke(api.channels.toMain.getBuildSetting, 'variables');
        const updatedVariables = result.map(obj => { return obj[0] })
        setVariables(updatedVariables.map(label => ({ label, value: label })))
    }
    function setVariable(variable) {
        if (ifElse !== undefined) {
            ifElse.variable = variable
        }
        props.callback(props.component, ifElse)
    }

    function setOperator(operator) {
        if (ifElse !== undefined) {
            ifElse.operator = operator
        }
        props.callback(props.component, ifElse)
    }

    function setComparison(comparison) {
        if (ifElse !== undefined) {
            ifElse.comparison = comparison
        }
        props.callback(props.component, ifElse)
    }

    function setVariableAndText(string) {
        setVariable(string)
        setVariableButtonText(string);
    }

    function setOperatorAndText(string) {
        setOperator(string)
        setOperatorButtonText(string);
    }

    function updateThenActionSequence(sequence) {
        if (ifElse !== undefined) {
            ifElse.then = sequence
        }
        props.callback(props.component, ifElse)
    }

    function updateElseActionSequence(sequence) {
        if (ifElse !== undefined) {
            ifElse.else = sequence
        }
        props.callback(props.component, ifElse)
    }

    return (
        <SettingAccordion
            summary={'If-Else Condition Component'}
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
                        title="Variable"
                        options={variables}
                        selected={ifElse?.variable}
                        onSelect={item => {
                            setVariableAndText(item.value.toString());
                        }}
                        onDeselect={_ => { setVariableAndText("") }}
                        onOpen={() => loadVariables()}
                    >
                        <Button>{variableButtonText || 'Select variable...'}</Button>
                    </SelectMenu>
                    <SelectMenu
                        title="Operator"
                        options={operators}
                        selected={ifElse?.operator}
                        onSelect={item => {
                            setOperatorAndText(item.value.toString())
                        }
                        }
                        onDeselect={_ => { setOperatorAndText("") }}
                    >
                        <Button>{operatorButtonText || 'Select operator...'}</Button>
                    </SelectMenu>
                    <TextInput
                        type="text"
                        placeholder="Comparison"
                        onChange={e => setComparison(e.target.value)}
                    />
                    <h3>Then:</h3>
                    {<ActionSequence callback={updateThenActionSequence}></ActionSequence>}
                    <h3>Else:</h3>
                    {<ActionSequence callback={updateElseActionSequence}></ActionSequence>}
                </Pane>
            }
        />
    );
};

export default IfElseConditionComponent;


