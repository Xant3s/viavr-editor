import React, { useState } from 'react'
import ActionSequence from './ActionSequence'
import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui'
import { SettingAccordionAction } from '../../Settings/SettingAccordion'
import { Action, IfElse, Variable } from '../../../@types/Behaviors'
import { ActionSequenceComponent } from './EventsEditor'


interface Props {
    depth: number
    ifElse: IfElse
    availableActions: Action[]
    sceneObjects: any[]
    updateIfElse: (ifElse: any) => void
    deleteIfElse: () => void
}


const IfElseConditionComponent = (props: Props) => {
    const [availableVariables, setAvailableVariables] = useState<Variable[]>([]) 

    
    async function loadVariables() {
        const loadedVariables: Variable[] = await api.invoke(api.channels.toMain.getBuildSetting, 'variables')
        setAvailableVariables(loadedVariables)
    }
    
    function setVariable(variableName: string | undefined) {
        const variable = availableVariables.find(variable => variable.name === variableName)
        const newIfElse = props.ifElse
        newIfElse.variable = variable?.name || ''
        newIfElse.variabletype = variable?.type || ''
        props.updateIfElse(newIfElse)
    }

    function setOperator(operator: string) {
        if(props.ifElse === undefined) return
        const newIfElse = props.ifElse
        newIfElse.operator = operator
        props.updateIfElse(newIfElse)
    }

    function setComparison(comparison: string) {
        if(props.ifElse === undefined) return
        const newIfElse = props.ifElse
        newIfElse.comparison = comparison
        props.updateIfElse(newIfElse)
    }

    function updateThenActionSequence(sequence: ActionSequenceComponent[]) {
        if(props.ifElse === undefined) return
        const newIfElse = props.ifElse
        newIfElse.then = sequence
        props.updateIfElse(newIfElse)
    }

    function updateElseActionSequence(sequence: ActionSequenceComponent[]) {
        if(props.ifElse === undefined) return
        const newIfElse = props.ifElse
        newIfElse.else = sequence
        props.updateIfElse(newIfElse)
    }

    return (
        <SettingAccordionAction
            summary={<div style={{alignItems:'center', display:'flex'}}>
            <DragHandleVerticalIcon style={{marginRight:'5px'}}></DragHandleVerticalIcon>
            If-Else Condition Component
            </div>}
            onClose={() => props.deleteIfElse()}
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
                            options={availableVariables.map(variable => ({...variable,  label: variable.name}))}
                            selected={props.ifElse?.variable}
                            onSelect={item => setVariable(item.value.toString())}
                            onDeselect={_ => setVariable(undefined)}
                            onOpen={() => loadVariables()}
                        >
                            <Button>{props.ifElse?.variable || 'Select variable...'}</Button>
                        </SelectMenu>
                        <Select style={{marginLeft:'7px', marginRight:'7px', minWidth:'20%'}} 
                            name="select-operator" value={props.ifElse?.operator} 
                        onChange={e => {setOperator(e.target.value)
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

                        {props.ifElse.variabletype === "boolean"?
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
                        <h3 style={{ marginBottom: '0px' }}>Then:</h3>
                        {<ActionSequence depth={props.depth + 1}
                                         sequence={props.ifElse.then.map((args, index) => ({...args, id: index}))}
                                         updateSequence={updateThenActionSequence}
                                         sceneObjects={props.sceneObjects}
                                         availableActions={props.availableActions}
                        />
                        }
                    </div>

                    <div>
                        <h3 style={{marginBottom:'0px'}}>Else:</h3>
                        {<ActionSequence depth={props.depth + 1}
                                         sequence={props.ifElse.else.map((args, index) => ({...args, id: index}))}
                                         updateSequence={updateElseActionSequence}
                                         sceneObjects={props.sceneObjects}
                                         availableActions={props.availableActions}
                        />
                        }
                    </div>
                </Pane>
            }
        />
    )
}

export default IfElseConditionComponent


