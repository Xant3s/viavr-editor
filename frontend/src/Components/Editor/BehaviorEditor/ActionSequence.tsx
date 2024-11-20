import React from 'react'
import ActionComponent from './ActionComponent'
import IfElseConditionComponent from './IfElseConditionComponent'
import { Button, Pane } from 'evergreen-ui'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Action, IfElse } from '../../../@types/Behaviors'
import { ActionSequenceComponent } from './EventsEditor'

interface Props {
    depth: number
    sequence: ActionSequenceComponent[]
    updateSequence: (newSequence: ActionSequenceComponent[]) => void
    availableActions: Action[]
    sceneObjects: any[]
}


const ActionSequence = (props: Props) => {
    const addAction = () => {
        const newAction: Action = {
            displayName: '', 
            name: '', 
            parameters: []
        }
        props.updateSequence([...props.sequence, { ...newAction, id: Date.now() }])
    }

    const addIfElse = () => {
        const newIfElse: IfElse = {
            comparison: '', 
            else: [], 
            operator: '', 
            then: [], 
            variable: '', 
            variabletype: '',
        }
        props.updateSequence([...props.sequence, { ...newIfElse, id: Date.now() }])
    }

    const removeComponent = (id) => {
        const newSequence = props.sequence.filter(component => component["id"] !== id)
        props.updateSequence(newSequence)
    }

    function callbackAction(givenComponent: ActionSequenceComponent, action: Action) {
        const comp = props.sequence.find(component => component["id"] === givenComponent.id)
        if (comp !== undefined) {
            comp["name"] = action.name
            comp["displayName"] = action.displayName
            comp["parameters"] = action.parameters
        }
        props.updateSequence(props.sequence)
    }

    function callbackIfElse(givenComponent: ActionSequenceComponent, ifElse) {
        const comp = props.sequence.find(component => component["id"] === givenComponent.id)
        if (comp !== undefined) {
            comp["variable"] = ifElse["variable"]
            comp["operator"] = ifElse["operator"]
            comp["comparison"] = ifElse["comparison"]
            comp["then"] = ifElse["then"]
            comp["else"] = ifElse["else"]
        }
        props.updateSequence(props.sequence)
    }

    const renderComponent = (component: ActionSequenceComponent) => {
        const isAction = component['name'] !== undefined

        if(isAction) {
            return <ActionComponent action={component as Action} availableActions={props.availableActions}
                                    sceneObjects={props.sceneObjects} key={component.id}
                                    updateAction={(action) => callbackAction(component, action as Action)}
                                    deleteActionComponent={() => removeComponent(component.id)} />
        }
        
        return <IfElseConditionComponent depth={props.depth + 1} 
                                         availableActions={props.availableActions} 
                                         sceneObjects={props.sceneObjects} 
                                         key={component.id} 
                                         component={component} 
                                         callback={callbackIfElse} OnClose={() => removeComponent(component.id)}
        />
    }

    const reorder = (startIndex, endIndex) => {
        const result = Array.from(props.sequence)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    const handleDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) return
        props.updateSequence(reorder(result.source.index, result.destination.index))
    }

    return (
        <Pane
            padding={20}
            paddingTop={0}
            //border="default"
            //borderRadius={8}
            //boxShadow="0 1px 2px rgba(67, 90, 111, 0.1), 0 2px 4px rgba(67, 90, 111, 0.1)"
            //marginBottom={20}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <h3> Actions</h3>
            
            <div style={{width:'100%', paddingTop:'15px', paddingBottom:'10px', marginBottom:'10px',
                borderColor:'#888e94', borderRadius:'8px', borderStyle:'dashed'}}>
                {props.sequence.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd} >
                    <Droppable droppableId="action-list" direction="vertical">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <Pane>
                                    {props.sequence.map((component, index) => (
                                        <Draggable key={component.id} draggableId={component.id.toString()} index={index}>
                                            {(provided) => (
                                                <Pane
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    key={component.id}
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    width="100%"
                                                    marginBottom={8}
                                                >
                                                    {renderComponent(component)}
                                                </Pane>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Pane>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>): <p style={{fontSize: '12px', color:'#b8bcbf'}}>No Actions added. Add an Action or If-Else Component to declare <br /> what happens in case the event is called.  </p>}
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Button style={{marginRight:'5px' ,background:'#006EFF',color:'white', borderColor:'#006EFF'}} 
                    onClick={addAction}>Add Action
            </Button>
            {props.depth < 3 && (
            <Button 
            style={{marginLeft:'5px' ,background:'#006EFF',color:'white', borderColor:'#006EFF'}} 
            onClick={addIfElse}>
                Add If-Else Condition
            </Button>
            )}
            </div>
        </Pane>
    )
}

export default ActionSequence
