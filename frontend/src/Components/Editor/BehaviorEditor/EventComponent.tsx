import { useState } from 'react';
import { SettingAccordionEvent } from '../../Settings/SettingAccordion'
import ActionSequence from './ActionSequence';
import { TextInput, Select, Pane } from 'evergreen-ui';
import { Action, Event, Parameter } from '../../../@types/Behaviors'
import { ActionSequenceComponent } from './EventsEditor'

interface Props {
    event: Event
    updateEvent: (event: Event) => void
    deleteEvent: () => void
    availableActions: Action[]
    sceneObjects: any[]
}

const EventComponent = (props: Props) => {
    const [options] = useState(["", "Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label, })))


    function updateParameterValue(parameterToChange: Parameter, value: string) {
        const updatedParameters = props.event.parameters.map(parameter =>
            parameter.name === parameterToChange.name
                ? { ...parameter, value }
                : parameter
        )

        const updatedEvent = {...props.event, parameters: updatedParameters}
        props.updateEvent(updatedEvent)
    }

    function updateActionSequence(sequence: ActionSequenceComponent[]) {
        const newSequence = sequence.map(({id, ...rest}) => rest)
        const newEvent = props.event
        newEvent.actionSequence = newSequence
        props.updateEvent(newEvent)
    }

    return (
        <SettingAccordionEvent
            summary={props.event.displayName}
            onClose={() => props.deleteEvent()}
            details={
                <Pane>
                    {props.event.parameters.length > 0 ? (
                        <div style={{ marginBottom: '10px', borderBottom: 'solid', borderColor: '#4D535B', borderWidth: '1px', paddingBottom: '25px' }}>
                            {props.event.description &&
                                <div style={{ backgroundColor: '#848c91', borderRadius: '6px', fontSize: '14px', margin: '5px', padding: '5px' }}>
                                    {props.event.description}
                                </div>
                            }

                            <h3>Parameters </h3>
                            {props.event.parameters.map((parameter, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }} >
                                    <div style={{ textAlign: 'left', float: 'left', marginLeft: '15px', width: '180px' }}>
                                        <p>
                                            {parameter["name"]}
                                        </p>
                                    </div>
                                    {parameter["name"] === 'gameObject' || parameter["name"] === 'other' ? (
                                        // Render a slider with gameObject's from the scene for 'gameObject' parameters
                                        <div>
                                            <Select value={parameter["value"]} onChange={e => updateParameterValue(parameter, e.target.value)} required>
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
                                                value={parameter["value"]} onChange={e => updateParameterValue(parameter, e.target.value)} required>
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
                                            type="text"
                                            placeholder="Parameter Value"
                                            value={parameter["value"]}
                                            onChange={(e) => updateParameterValue(parameter, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>
                            This event contains no parameters.
                        </p>
                    )}
                    <ActionSequence depth={1} 
                                    sequence={props.event.actionSequence.map((component, index) => ({...component, id: index}))} 
                                    availableActions={props.availableActions} 
                                    sceneObjects={props.sceneObjects} 
                                    updateSequence={updateActionSequence}></ActionSequence>
                </Pane>
            }
        />
    )
}

export default EventComponent