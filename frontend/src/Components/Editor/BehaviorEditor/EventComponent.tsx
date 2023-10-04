import { useState } from 'react';
import { SettingAccordion } from '../../Settings/SettingAccordion'
import ActionSequence from './ActionSequence';
import { TextInput } from 'evergreen-ui';
import { Event, Parameter, eventTypes } from '../../../@types/Behaviors';

const EventComponent = (props) => {
    

    const [event, setEvent] = useState<Event>(props.event)

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
        <SettingAccordion
            summary={props.event["name"]}
            details={
                <div>
                    {event.parameters.length > 0 ? (
                        <div>
                            Parameters: {event.parameters.map((parameter, index) => (
                                <div key={index}>
                                    <p>
                                        {parameter["name"]} ({parameter["type"]})
                                    </p>
                                    <TextInput
                                        type="text"
                                        placeholder="Parameter Value"
                                        value={parameter["value"]}
                                        onChange={e => updateParameters(parameter, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>
                            Parameters: None
                        </p>
                    )}
                    <ActionSequence callback={updateActionSequence}></ActionSequence>
                </div>
            }
        />
    )
}

export default EventComponent;