import { useState } from 'react';
import { SettingAccordionEvent } from '../../Settings/SettingAccordion'
import ActionSequence from './ActionSequence';
import { TextInput, Select, Pane } from 'evergreen-ui';
import { Event } from '../../../@types/Behaviors'


const EventComponent = (props) => {
    const [event, setEvent] = useState<Event>(props.event)
    const [selectedObject, setSelectedObject] = useState<any>({})
    // if there is a parameter "gameobject" or "other" that is not empty
    // selectedObject must be set to the corresponding object from props.sceneObjects (search for sceneObject.uuid with the value in the parameter)
    const [options] = useState(["", "Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label, })))


    function updateParameters(param, value) {
        const parameter = event.parameters.find(parameter => parameter.name === param.name);
        if (parameter !== undefined) {
            parameter.value = value
        }
        props.callback(event)
    }

    function updateActionSequence(sequence) {
        event.actionSequence = sequence
        props.callback(event)
    }

    return (
        <SettingAccordionEvent
            summary={props.event.displayName}
            onClose={() => props.OnClose()}
            details={
                <Pane>
                    {event.parameters.length > 0 ? (
                        <div style={{ marginBottom: '10px', borderBottom: 'solid', borderColor: '#4D535B', borderWidth: '1px', paddingBottom: '25px' }}>
                            {event.description &&
                                (<div style={{ backgroundColor: '#848c91', borderRadius: '6px', fontSize: '14px', margin: '5px', padding: '5px' }}> {event.description}</div>)
                            }

                            <h3>Parameters </h3>
                            {event.parameters.map((parameter, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }} >
                                    <div style={{ textAlign: 'left', float: 'left', marginLeft: '15px', width: '180px' }}>
                                        <p>
                                            {parameter["name"]}
                                        </p>
                                    </div>
                                    {parameter["name"] === 'gameObject' || parameter["name"] === 'other' ? (
                                        // Render a slider with gameObject's from the scene for 'gameObject' parameters
                                        <div>
                                            <Select value={parameter["value"]} onChange={e => updateParameters(parameter, e.target.value)} required>
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
                                                value={parameter["value"]} onChange={e => updateParameters(parameter, e.target.value)} required>
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
                                            onChange={(e) => updateParameters(parameter, e.target.value)}
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
                    <ActionSequence depth={1} loadedSequence={props.event.actionSequence} availableActions={props.availableActions} sceneObjects={props.sceneObjects} callback={updateActionSequence}></ActionSequence>
                </Pane>
            }
        />
    )
}

export default EventComponent