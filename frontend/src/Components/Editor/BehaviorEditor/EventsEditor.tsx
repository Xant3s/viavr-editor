import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Pane, SelectMenu, ChevronDownIcon } from 'evergreen-ui'
import { useCallback, useEffect, useState } from 'react'
import EventComponent from './EventComponent'
import { Action, Event } from '../../../@types/Behaviors'
import { FormControl, FormHelperText } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Tooltip} from 'react-tooltip'


export const EventsEditor = ({hidden}) => {
    const [availableEvents, setAvailableEvents] = useState<Event[]>([])
    const [availableActions, setAvailableActions] = useState<Action[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [event, setEvent] = useState<string>('')
    const [eventButtonText, setEventButtonText] = useState<string>('')
    const [triedAddingEvent, setTriedAddingEvent] = useState<boolean>()
    const [sceneObjects, setSceneObjects] = useState<any[]>([])

    
    const loadSceneObjects = async () => {
        let objects = await api.invoke(api.channels.toMain.getSceneObjects)
        const emptyObject = {
            "name": "",
            "components": [],
            "uuid": ""
        }
        objects = [emptyObject, ...objects];
        setSceneObjects(objects)
    }

    const loadActions = useCallback(async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        const packagesWithActions = packages.filter(item => 'actions' in item)
        let actionList: Action[] = []
        packagesWithActions.forEach(packageWithActions => {
            actionList = actionList.concat(packageWithActions['actions'] as Action[])
        })

        setAvailableActions(actionList)
    }, [])

    const loadEvents = useCallback(async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        const packagesWithEvents = packages.filter(item => 'events' in item)
        let eventList: Event[] = []
        packagesWithEvents.forEach(packageWithEvents => {
            eventList = eventList.concat(packageWithEvents["events"] as Event[])
        })

        setAvailableEvents(eventList)
    }, [])

    const loadSavedEvents = async () => {
        const loadedEvents = await api.invoke(api.channels.toMain.getBuildSetting, 'events') ?? []
        setEvents(loadedEvents)
    }

    useEffect(() => {
        loadActions()
        loadEvents()
        if(!hidden) {
            loadSceneObjects()
            loadSavedEvents()
        }
    }, [loadActions, loadEvents, hidden])

function setEventAndText(eventName) {
    setEvent(eventName)
    setEventButtonText(eventName)
}

const addEvent = async (eventName: string) => {
    const e = availableEvents.find(item => item.name === eventName)

    if (e !== undefined) {
        const name = eventName
        const param = e.parameters.map(x => Object.assign({}, x)) 
        setEvents([...events, {description: e.description, displayName: e.displayName, name: name, id: Date.now(), parameters: param, actionSequence: []}])
        await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
    }
}

const removeEvent = async (id) => {
    setEvents(events.filter(event => event["id"] !== id));
    await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
}

async function updateEvent(event) {
    const updatedEvents = events.map((obj) => {
        return obj.id === event.id ? event : obj;
    })
    setEvents(updatedEvents)
    await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
}

const handleEventClose = () =>{
    console.log("call method in events editor")
}

return (
    <SettingAccordion
        summary={
            <span style={{display:'flex', alignItems:'center'}}>
                <span style={{margin:'0px', padding:'0px'}}>Events</span>
                <HelpOutlineIcon data-tooltip-id="Variables" data-tooltip-content={"Events can be used to start actions after a certain condition is met. This functionality can be added by enabling additional packages."} style={{ marginLeft: 5, fontSize: 14 }}/>
                <Tooltip id="Variables" place="right" style={{fontSize: '14px'}} />
            </span>
        }
        details={
            <div>
                {events.map((event, index) => (
                    <Pane
                        key={index}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        marginBottom={8}
                    >
                        <EventComponent event={event} availableActions={availableActions} sceneObjects={sceneObjects} callback={updateEvent} OnClose={() => removeEvent(event["id"])}/>
                        {/* <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => removeEvent(event["id"])} /> */}
                    </Pane>
                ))}
                <FormControl>
                <SelectMenu
                    title='Select event'
                    options={availableEvents.map(event => ({ label: event.displayName, value: event.name }))}
                    selected={event}
                    onSelect={item => {
                        setEventAndText(item.value.toString())
                    }}
                    onDeselect={_ => { setEventAndText("") }}
                >
                    <Button>{eventButtonText  || 'Select event...'} <ChevronDownIcon style={{marginLeft: '2px'}} /> </Button>
                </SelectMenu>
                {triedAddingEvent && !event && <FormHelperText style={{color:'red'}}>You have to select an event to add!</FormHelperText>}
                </FormControl>
                <Button
                    style={{marginLeft: '5px',
                    background: event ? '#006EFF' : '#afb2ba',
                    color: event ? 'white' : 'gray',
                    cursor: event? 'pointer' : 'auto',
                    border: event ? '#006EFF' : 'gray',}}
                    onClick={() => {
                    if (event) {
                    addEvent(event);
                    setTriedAddingEvent(false);
                    }
                    else{
                        setTriedAddingEvent(true);
                    }
                    }}
                    >
                    Add Event
                </Button>
                
        </div>
        }
    />
)}
