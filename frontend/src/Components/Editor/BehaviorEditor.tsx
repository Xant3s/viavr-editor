import { useEffect, useState } from "react"
import { Button, TextInput, toaster, Table, TrashIcon, SideSheet, TextDropdownButton, SelectMenu, Select, SelectField, TextInputField } from 'evergreen-ui'
import { TaskInfo } from '../../@types/TaskInfo'
import { ConditionInfo } from '../../@types/ConditionInfo'
import { ActionInfo } from '../../@types/ActionInfo'
import { SettingAccordion } from "../Settings/SettingAccordion"
import { DropDownSetting } from "../Settings/DropDownSetting"
import { Row } from "../StyledComponents/Row"

export const BehaviorEditor = ({ hidden }) => {
    const [tasks, setTasks] = useState<TaskInfo[]>([])
    const [newTaskIdentifier, setNewTaskIdentifier] = useState<string>('')
    const [newTaskDescription, setNewTaskDescription] = useState<string>('')
    const [isSideSheetShown, setIsSideSheetShown] = useState(false)
    const [taskDetails, setTaskDetails] = useState<TaskInfo>()
    const [conditions, setConditions] = useState<ConditionInfo[]>([])
    const [newConditionIdentifier, setNewConditionIdentifier] = useState<string>('')
    const [newConditionDescription, setNewConditionDescription] = useState<string>('')
    const [actions, setActions] = useState<ActionInfo[]>([])
    const [newActionIdentifier, setNewActionIdentifier] = useState<string>('')

    const addNewTask = () => {
        if (newTaskIdentifier === '') {
            toaster.danger('Please enter an identifier for the task')
            return
        }
        if (tasks.find(task => task.identifier === newTaskIdentifier)) {
            toaster.danger('The task identifier has to be unique')
            return
        }
        if (newTaskDescription === '') {
            toaster.danger('Please enter a description for the task')
            return
        }


        const newTask = { identifier: newTaskIdentifier, description: newTaskDescription, conditions: [], actions: [] }
        const newTasks = [...tasks, newTask]
        setTasks(newTasks)
        setNewTaskIdentifier('')
        setNewTaskDescription('')
    }

    const addNewCondition = () => {
        if (newConditionIdentifier === '') {
            toaster.danger('Please enter an identifier for the condition')
            return
        }
        if (taskDetails?.conditions.find(condition => condition.identifier === newConditionIdentifier)) {
            toaster.danger('The condition identifier has to be unique')
            return
        }
        if (newConditionDescription === '') {
            toaster.danger('Please enter a description for the condition')
            return
        }

        const newCondition = { identifier: newConditionIdentifier, description: newConditionDescription }
        const newConditions = [...taskDetails!.conditions, newCondition]
        if (taskDetails?.conditions !== undefined) {
            taskDetails.conditions = newConditions
            setConditions(taskDetails?.conditions)
        }
        setNewConditionIdentifier('')
        setNewConditionDescription('')
    }

    const addNewAction = () => {
        if (newActionIdentifier === '') {
            toaster.danger('Please enter an identifier for the action')
            return
        }
        if (taskDetails?.actions.find(action => action.identifier === newActionIdentifier)) {
            toaster.danger('The action identifier has to be unique')
            return
        }

        const newAction = { identifier: newActionIdentifier }
        const newActions = [...taskDetails!.actions, newAction]
        if (taskDetails?.actions !== undefined) {
            taskDetails.actions = newActions
            setActions(taskDetails?.actions)
        }
        setNewActionIdentifier('')
    }

    const deleteTask = (taskId) => {
        const newTasks = tasks.filter(task => task.identifier !== taskId)
        setTasks(newTasks)
    }

    const deleteCondition = (conditionId) => {
        const newConditions = taskDetails?.conditions.filter(condition => condition.identifier !== conditionId)
        if (taskDetails?.conditions !== undefined && newConditions !== undefined) {
            taskDetails.conditions = newConditions
        }
        setTaskDetails(taskDetails)
        if (taskDetails?.conditions !== undefined) {
            setConditions(taskDetails?.conditions)
        }
    }

    const deleteAction = (actionId) => {
        const newActions = taskDetails?.actions.filter(action => action.identifier !== actionId)
        if (taskDetails?.actions !== undefined && newActions !== undefined) {
            taskDetails.actions = newActions
        }
        setTaskDetails(taskDetails)
        if (taskDetails?.actions !== undefined) {
            setActions(taskDetails?.actions)
        }
    }

    const exportJSON = () => {
        const e = {
            tasks: tasks,
            // TODO add conditionSwitches and the associated GameObjects after tasks
        }
        const json = JSON.stringify(e)
        console.log(json)
    }

    return <div hidden={hidden} style={{ backgroundColor: '#3a4048', height: 'calc(100vh - 76px)', margin: 0, padding: 10, textAlign: 'center', color: 'white' }}>
        <h1>Behavior Editor</h1>

        <SettingAccordion summary={'Questlines'} details={(
            <div>
                <SettingAccordion summary={'Questline1'} details={(
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.TextHeaderCell>Task Identifier</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Task Description</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Details</Table.TextHeaderCell>
                                <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body height={240} minWidth={'600px'}>
                                {tasks.map((task: TaskInfo) => (
                                    <Table.Row key={task.identifier}>
                                        <Table.TextCell>{task.identifier}</Table.TextCell>
                                        <Table.TextCell>{task.description}</Table.TextCell>
                                        <Table.TextCell>
                                            <Button appearance='primary'
                                                style={{ width: '100%' }}
                                                onClick={() => {
                                                    setTaskDetails(task)
                                                    setConditions(task.conditions)
                                                    setActions(task.actions)
                                                    setIsSideSheetShown(true)
                                                }}
                                            >
                                                Show Details
                                            </Button>
                                        </Table.TextCell>
                                        <Table.TextCell>
                                            <Button iconBefore={TrashIcon}
                                                appearance='minimal'
                                                intent='danger'
                                                onClick={() => {
                                                    deleteTask(task.identifier)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Table.TextCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>

                        <SideSheet
                            isShown={isSideSheetShown}
                            onCloseComplete={() => setIsSideSheetShown(false)}
                            containerProps={{
                                padding: '15px'
                            }}
                        >
                            <div>
                                <h2>Conditions</h2>
                                <Table>
                                    <Table.Head>
                                        <Table.TextHeaderCell>Condition Identifier</Table.TextHeaderCell>
                                        <Table.TextHeaderCell>Condition Description</Table.TextHeaderCell>
                                        <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                                    </Table.Head>
                                    <Table.Body height={240} minWidth={'600px'}>
                                        {conditions.map((condition: ConditionInfo) => (
                                            <Table.Row key={condition.identifier}>
                                                <Table.TextCell>{condition.identifier}</Table.TextCell>
                                                <Table.TextCell>{condition.description}</Table.TextCell>
                                                <Table.TextCell>
                                                    <Button iconBefore={TrashIcon}
                                                        appearance='minimal'
                                                        intent='danger'
                                                        onClick={() => {
                                                            deleteCondition(condition.identifier)
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Table.TextCell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>

                                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                                    <TextInput placeholder="Identifier..." value={newConditionIdentifier} onChange={(e) => setNewConditionIdentifier(e.target.value)}></TextInput>
                                    <TextInput placeholder="Description..." value={newConditionDescription} onChange={(e) => setNewConditionDescription(e.target.value)}></TextInput>
                                    <Button appearance='primary'
                                        onClick={() => {
                                            addNewCondition()
                                        }}
                                    >Add new condition</Button>
                                </div>
                            </div>


                            <div style={{ marginTop: '40px' }}>
                                <h2>Actions</h2>
                                <Table>
                                    <Table.Head>
                                        <Table.TextHeaderCell>Action Identifier</Table.TextHeaderCell>
                                        <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                                    </Table.Head>
                                    <Table.Body height={240} minWidth={'600px'}>
                                        {actions.map((action: ActionInfo) => (
                                            <Table.Row key={action.identifier}>
                                                <Table.TextCell>{action.identifier}</Table.TextCell>
                                                <Table.TextCell>
                                                    <Button iconBefore={TrashIcon}
                                                        appearance='minimal'
                                                        intent='danger'
                                                        onClick={() => {
                                                            deleteAction(action.identifier)
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Table.TextCell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>

                                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                                    <TextInput placeholder="Identifier..." value={newActionIdentifier} onChange={(e) => setNewActionIdentifier(e.target.value)}></TextInput>
                                    <Button appearance='primary'
                                        onClick={() => {
                                            addNewAction()
                                        }}
                                    >Add new action</Button>
                                </div>
                            </div>

                        </SideSheet>

                        <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                            <TextInput placeholder="Identifier..." value={newTaskIdentifier} onChange={(e) => setNewTaskIdentifier(e.target.value)}></TextInput>
                            <TextInput placeholder="Description..." value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)}></TextInput>
                            <Button appearance='primary'
                                onClick={() => {
                                    addNewTask()
                                }}
                            >Add new task</Button>
                        </div>
                    </div>
                )} />

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                    <Button appearance="primary" onClick={() => {
                        // TODO implement adding new questlines
                    }}>
                        Add new Questline
                    </Button>
                </div>

            </div>


        )} />

        {/* TODO this has to be different from the other conditions related to the questlines */}
        <SettingAccordion summary={'Global Conditions'} details={(
            <div>
                <h2>Global Conditions</h2>
                <Table>
                    <Table.Head>
                        <Table.TextHeaderCell>Condition Identifier</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Condition Description</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body height={240} minWidth={'600px'}>
                        {conditions.map((condition: ConditionInfo) => (
                            <Table.Row key={condition.identifier}>
                                <Table.TextCell>{condition.identifier}</Table.TextCell>
                                <Table.TextCell>{condition.description}</Table.TextCell>
                                <Table.TextCell>
                                    <Button iconBefore={TrashIcon}
                                        appearance='minimal'
                                        intent='danger'
                                        onClick={() => {
                                            deleteCondition(condition.identifier)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Table.TextCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                    <TextInput placeholder="Identifier..." value={newConditionIdentifier} onChange={(e) => setNewConditionIdentifier(e.target.value)}></TextInput>
                    <TextInput placeholder="Description..." value={newConditionDescription} onChange={(e) => setNewConditionDescription(e.target.value)}></TextInput>
                    <Button appearance='primary'
                        onClick={() => {
                            addNewCondition()
                        }}
                    >Add new condition</Button>
                </div>
            </div>
        )} />

        <SettingAccordion summary={'ConditionSwitches'} details={(
            <div>
                <SettingAccordion summary={'ConditionSwitch1'} details={(
                    <div>
                        <SelectField label="Questline">
                            <option value="foo" selected>Foo</option>
                            <option value="bar">Bar</option>
                        </SelectField>

                        <SelectField label="Task">
                            <option value="foo" selected>Foo</option>
                            <option value="bar">Bar</option>
                        </SelectField>

                        <SelectField label="Condition">
                            <option value="foo" selected>Foo</option>
                            <option value="bar">Bar</option>
                        </SelectField>

                    </div>
                )} />

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                    <Button appearance="primary" onClick={() => {
                        // TODO implement adding new condition switches
                    }}>
                        Add new ConditionSwitch
                    </Button>
                </div>
            </div>
        )} />

        <SettingAccordion summary={'ConditionSwitchSetters'} details={(
            <div>
                <SettingAccordion summary={'ConditionSwitchSetter1'} details={(
                    <div>
                        <SelectField label="Type">
                            <option value="foo" selected>Foo</option>
                            <option value="bar">Bar</option>
                        </SelectField>

                        <SelectField label="Object">
                            <option value="foo" selected>Foo</option>
                            <option value="bar">Bar</option>
                        </SelectField>
                    </div>
                )} />

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                    <Button appearance="primary" onClick={() => {
                        // TODO implement adding new condition switches
                    }}>
                        Add new ConditionSwitchSetter
                    </Button>
                </div>
            </div>
        )} />

        <SettingAccordion summary={'Global States'} details={(
            <div>
                <SettingAccordion summary={'State1'} details={(
                    <Row>

                            <TextInputField label="Name" placeholder="Name..."></TextInputField>
                            <TextInputField label="Value" placeholder="Value..."></TextInputField>
                    </Row>
                )} />

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                    <Button appearance="primary" onClick={() => {
                        // TODO implement adding new global states
                    }}>
                        Add new Global State
                    </Button>
                </div>
            </div>
        )} />

        <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
            <Button appearance='primary'
                onClick={() => {
                    // TODO just for developing purposes. Has to be automated in the end
                    exportJSON()
                }}
            >EXPORT</Button>
        </div>
    </div>
}
