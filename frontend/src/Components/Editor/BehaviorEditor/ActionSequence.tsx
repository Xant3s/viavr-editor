import React, { useState } from 'react';
import ActionComponent from './ActionComponent';
import IfElseConditionComponent from './IfElseConditionComponent';
import { Button, CrossIcon, Icon, IconButton, Pane } from 'evergreen-ui';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const ActionSequence = (props) => {
    const [components, setComponents] = useState<object[]>([]);

    const addComponent = (type) => {
        setComponents([...components, { type, id: Date.now() }]);        
        props.callback(components)
    };

    const removeComponent = (id) => {
        setComponents(components.filter(component => component["id"] !== id));
        props.callback(components)
    };

    function callbackAction(givenComponent, action) {
        const comp = components.find(component => component["id"] === givenComponent.id)
        if (comp !== undefined) {
            comp["name"] = action["name"]
            comp["parameters"] = action["parameters"]
        }
        props.callback(components)
    }

    function callbackIfElse(givenComponent, ifElse) {
        const comp = components.find(component => component["id"] === givenComponent.id)
        if (comp !== undefined) {
            comp["variable"] = ifElse["variable"]
            comp["operator"] = ifElse["operator"]
            comp["comparison"] = ifElse["comparison"]
            comp["then"] = ifElse["then"]
            comp["else"] = ifElse["else"]
        }
        props.callback(components)
    }

    const renderComponent = (component) => {
        if (component.type === 'action') {
            return <ActionComponent key={component.id} component={component} callback={callbackAction}/>;
        } else if (component.type === 'ifElse') {
            return <IfElseConditionComponent key={component.id} component={component} callback={callbackIfElse}/>;
        }
        return null;
    };

    const reorder = (startIndex, endIndex) => {
        const result = Array.from(components)
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const handleDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) return;

        setComponents(reorder(result.source.index, result.destination.index))
        props.callback(components)
    };

    return (
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
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="action-list" direction="vertical">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <Pane>
                                {components.map((component, index) => (
                                    <Draggable key={component["id"]} draggableId={component["id"].toString()} index={index}>
                                        {(provided) => (
                                            <Pane
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                key={component["id"]}
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                width="100%"
                                                marginBottom={8}
                                            >
                                                {renderComponent(component)}
                                                <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => removeComponent(component["id"])} />
                                            </Pane>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Pane>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button onClick={() => addComponent('action')}>Add Action</Button>
            <Button onClick={() => addComponent('ifElse')}>Add If-Else Condition</Button>
        </Pane>
    );
};

export default ActionSequence;
