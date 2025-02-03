import React, { useState } from 'react'
import ActionSequence from './ActionSequence'
import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui'
import { SettingAccordionAction } from '../../Settings/SettingAccordion'
import { Action, IfElse, Variable } from '../../../@types/Behaviors'
import { ActionSequenceComponent } from './EventsEditor'
import { useTranslation } from '../../../LocalizationContext'

interface Props {
    depth: number
    ifElse: IfElse
    availableActions: Action[]
    sceneObjects: any[]
    updateIfElse: (ifElse: any) => void
    deleteIfElse: () => void
}

const IfElseConditionComponent = (props: Props) => {
    const { translate } = useTranslation()
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
        newIfElse.operator = props.ifElse.operator === '' ? '=' : props.ifElse.operator
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
            summary={
                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <DragHandleVerticalIcon style={{ marginRight: '5px' }} />
                    {translate('if_else_summary_title')}
                </div>
            }
            onClose={() => props.deleteIfElse()}
            details={
                <Pane
                    padding={2}
                    marginBottom={10}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <div style={{ borderBottom: '2px solid #6C737A', paddingBottom: '12px' }}>
                        <h3>{translate('if_else_heading_if')}</h3>
                        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                            <SelectMenu
                                title={translate('if_else_selectmenu_variable')}
                                options={availableVariables.map(variable => ({ ...variable, label: variable.name }))}
                                selected={props.ifElse?.variable}
                                onSelect={item => setVariable(item.label)}
                                onDeselect={_ => setVariable(undefined)}
                                onOpen={() => loadVariables()}
                            >
                                <Button>{props.ifElse?.variable || translate('if_else_select_variable_placeholder')}</Button>
                            </SelectMenu>
                            <Select
                                style={{ marginLeft: '7px', marginRight: '7px', minWidth: '20%' }}
                                name="select-operator"
                                value={props.ifElse?.operator}
                                onChange={e => { setOperator(e.target.value) }}
                                required
                            >
                                <option key={"Equals"} value={"="}>
                                    {translate('if_else_operator_equals')}
                                </option>
                                <option key={"Does Not Equal"} value={"!="}>
                                    {translate('if_else_operator_does_not_equal')}
                                </option>
                                <option key={"Is Greater Than"} value={">"}>
                                    {translate('if_else_operator_is_greater_than')}
                                </option>
                                <option key={"Is Less Than"} value={"<"}>
                                    {translate('if_else_operator_is_less_than')}
                                </option>
                            </Select>

                            {props.ifElse.variabletype === "boolean" ? (
                                <Select
                                    style={{ marginLeft: '7px', marginRight: '7px' }}
                                    name="select-type"
                                    onChange={e => { setComparison(e.target.value) }}
                                    required
                                >
                                    <option key={"true"} value="true">
                                        {translate('if_else_boolean_yes')}
                                    </option>
                                    <option key={"false"} value="false">
                                        {translate('if_else_boolean_no')}
                                    </option>
                                </Select>
                            ) : (
                                <TextInput
                                    style={{ marginRight: '7px', maxWidth: '40%' }}
                                    type="text"
                                    placeholder={translate('if_else_placeholder_comparison')}
                                    onChange={e => setComparison(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ borderBottom: '2px solid #6C737A' }}>
                        <h3 style={{ marginBottom: '0px' }}>{translate('if_else_heading_then')}</h3>
                        {<ActionSequence
                            depth={props.depth + 1}
                            sequence={props.ifElse.then.map((args, index) => ({ ...args, id: index }))}
                            updateSequence={updateThenActionSequence}
                            sceneObjects={props.sceneObjects}
                            availableActions={props.availableActions}
                        />}
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '0px' }}>{translate('if_else_heading_else')}</h3>
                        {<ActionSequence
                            depth={props.depth + 1}
                            sequence={props.ifElse.else.map((args, index) => ({ ...args, id: index }))}
                            updateSequence={updateElseActionSequence}
                            sceneObjects={props.sceneObjects}
                            availableActions={props.availableActions}
                        />}
                    </div>
                </Pane>
            }
        />
    )
}

export default IfElseConditionComponent
