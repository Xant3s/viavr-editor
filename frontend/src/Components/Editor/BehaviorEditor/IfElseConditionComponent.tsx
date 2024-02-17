import React, { useState } from 'react';
import ActionSequence from './ActionSequence';
import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui';
import { SettingAccordion, SettingAccordionAction } from '../../Settings/SettingAccordion'
import { use } from 'chai';
import { IfElse, Variable } from '../../../@types/Behaviors';

const IfElseConditionComponent = (props) => {
    const [variables, setVariables] = useState<{label: string; value: string; type: string;}[]>([]) 
    const [variableButtonText, setVariableButtonText] = useState<string>('')
    const [operators] = useState(["=", "!="].map(label => ({ label, value: label, }))) // TODO this is only for development purposes
    const [operatorButtonText, setOperatorButtonText] = useState<string>('')

    const [ifElse, setIfElse] = useState<IfElse>(new IfElse())

    async function loadVariables() {
        const result: string[][] = await api.invoke(api.channels.toMain.getBuildSetting, 'variables');
        const updatedVariables = result.map(obj => { 
            return {
                label: obj[0], 
                value: obj[0],
                type: obj[1],
            }
        })
        setVariables(updatedVariables)
    }
    function setVariable(variable) {
        if (ifElse !== undefined) {
            ifElse.variable = variable
        }
        props.callback(props.component, ifElse)
    }
    function setVariableType(type){
        if(ifElse !== undefined) {
            ifElse.variabletype = type
        }
        props.callback(props.component, ifElse)
    }

    function handleClose(){
        console.log("Closing")
        props.OnClose()
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
        <SettingAccordionAction
            summary={<div style={{alignItems:'center', display:'flex'}}>
            <DragHandleVerticalIcon style={{marginRight:'5px'}}></DragHandleVerticalIcon>
            If-Else Condition Component
            </div>}
            onClose={() => handleClose()}
            details={
                <Pane
                    padding={2}
                    marginBottom={10}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <div style={{borderBottom: '2px solid #6C737A', paddingBottom:'12px'}}>
                    <h3>If:</h3>
                    <div style={{display: 'flex', justifyContent:'start', alignItems:'center'}}>
                        <SelectMenu
                            title="Variable"
                            options={variables}
                            selected={ifElse?.variable}
                            onSelect={item => {
                                setVariableAndText(item.value.toString());
                                const selectedType = variables.find((variable) => variable.label === item.label)?.type || '';
                                setVariableType(selectedType)
                                //console.log(selectedType)           
                            }}
                            onDeselect={_ => { setVariableAndText(""); setVariableType("") }}
                            onOpen={() => loadVariables()}
                        >
                            <Button>{variableButtonText || 'Select variable...'}</Button>
                        </SelectMenu>
                        <Select style={{marginLeft:'7px', marginRight:'7px', minWidth:'20%'}} 
                            name="select-operator" value={operatorButtonText} 
                        onChange={e => {setOperatorAndText(e.target.value)
                                            }} required>
                            <option key={0} value={"="}>
                                {"Equals"}
                            </option>
                            <option key={1} value={"!="}>
                                {"Does Not Equal"}
                            </option>
                            <option key={2} value={">"}>
                                {"Is Greater Than"}
                            </option>
                            <option key={2} value={"<"}>
                                {"Is Less Than"}
                            </option>
                        </Select>
                        
                        {ifElse.variabletype === "boolean"?
                        (
                            <Select style={{marginLeft:'7px', marginRight:'7px',}} name="select-type" onChange={e => {
                                setComparison(e.target.value)
                                }} required>
                                <option key={0} value="true">{"Yes"}</option>
                                <option key={1} value="false">{"No"}</option>
                            </Select>
                        ):
                        (
                            <TextInput
                            style={{marginRight:'7px', maxWidth:'40%'}}
                            type="text"
                            placeholder="Comparison"
                            onChange={e => setComparison(e.target.value)}
                            /> )}
                         
                    </div>
                    </div>

                    <div style={{borderBottom: '2px solid #6C737A'}}>
                    <h3 style={{marginBottom:'0px'}}>Then:</h3>
                    {<ActionSequence depth={props.depth+1} sceneObjects={props.sceneObjects} callback={updateThenActionSequence}></ActionSequence>}
                    </div>
                    
                    <div>
                    <h3 style={{marginBottom:'0px'}}>Else:</h3>
                    {<ActionSequence depth={props.depth+1} sceneObjects={props.sceneObjects} callback={updateElseActionSequence}></ActionSequence>}
                    </div>
                </Pane>
            }
        />
    );
};

export default IfElseConditionComponent;


