import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Pane, SelectMenu, ChevronDownIcon } from 'evergreen-ui'
import React, { useCallback, useEffect, useState } from 'react'
import EventComponent from './EventComponent'
import { Action, Event, IfElse } from '../../../@types/Behaviors'
import { FormControl, FormHelperText } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip } from 'react-tooltip'
import { useTranslation } from '../../../LocalizationContext'

export type ActionSequenceComponent = (Action | IfElse) & { id: number }

interface Props {
    hidden: boolean
}

export const EventsEditor: React.FC<Props> = ({ hidden }) => {
    const { translate } = useTranslation()
    const [availableEvents, setAvailableEvents] = useState<Event[]>([])
    const [availableActions, setAvailableActions] = useState<Action[]>([])
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [events, setEvents] = useState<Event[]>([])

    const [selectedEvent, setSelectedEvent] = useState<string | undefined>()
    const [triedAddingEvent, setTriedAddingEvent] = useState<boolean>()

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

    const loadAvailableActions = useCallback(async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        const packagesWithActions = packages.filter(item => 'actions' in item)
        let actionList: Action[] = []
        packagesWithActions.forEach(packageWithActions => {
            actionList = actionList.concat(packageWithActions['actions'] as Action[])
        })

        setAvailableActions(actionList)
    }, [])

    const loadAvailableEvents = useCallback(async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        const packagesWithEvents = packages.filter(item => 'events' in item)
        let eventList: Event[] = []
        packagesWithEvents.forEach(packageWithEvents => {
            eventList = eventList.concat(packageWithEvents["events"] as Event[])
        })

        setAvailableEvents(eventList)
    }, [])

    const loadEventsFromBuildSettings = async () => {
        const loadedEvents = await api.invoke(api.channels.toMain.getBuildSetting, 'events') ?? []
        setEvents(loadedEvents)
    }

    useEffect(() => {
        loadAvailableActions()
        loadAvailableEvents()
        if (!hidden) {
            loadSceneObjects()
            loadEventsFromBuildSettings()
        }
    }, [loadAvailableActions, loadAvailableEvents, hidden])

    const addEvent = async (name: string) => {
        const newEvent = availableEvents.find(event => event.name === name)
        if (newEvent === undefined) return
        newEvent.id = Date.now()
        newEvent.actionSequence = []
        const newEvents = [...events, newEvent]
        setEvents(newEvents)
        await api.invoke(api.channels.toMain.setBuildSetting, 'events', newEvents)
    }

    const removeEvent = async (id: number) => {
        const newEvents = events.filter(event => event['id'] !== id)
        setEvents(newEvents)
        await api.invoke(api.channels.toMain.setBuildSetting, 'events', newEvents)
    }

    async function updateEvent(newEvent: Event) {
        const updatedEvents = events.map(event => event.id === newEvent.id ? newEvent : event)
        setEvents(updatedEvents)
        await api.invoke(api.channels.toMain.setBuildSetting, 'events', updatedEvents)
    }

    return (
        <SettingAccordion
            summary={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ margin: '0px', padding: '0px' }}>{translate('events_summary_title')}</span>
                    <HelpOutlineIcon
                        data-tooltip-id="Variables"
                        data-tooltip-content={translate('events_tooltip_info')}
                        style={{ marginLeft: 5, fontSize: 14 }} />
                    <Tooltip id="Variables" place="right" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
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
                            <EventComponent event={event}
                                availableActions={availableActions}
                                sceneObjects={sceneObjects}
                                updateEvent={updateEvent}
                                deleteEvent={() => removeEvent(event.id)}
                            />
                        </Pane>
                    ))}
                    <FormControl>
                        <SelectMenu
                            title={translate('events_select_event_title')}
                            options={availableEvents.map(event => ({ label: event.displayName, value: event.name }))}
                            selected={selectedEvent}
                            onSelect={item => setSelectedEvent(item.value.toString())}
                            onDeselect={_ => { setSelectedEvent(undefined) }}
                        >
                            <Button>
                                {selectedEvent || translate('events_select_event_placeholder')}
                                <ChevronDownIcon style={{ marginLeft: '2px' }} />
                            </Button>
                        </SelectMenu>
                        {triedAddingEvent && !selectedEvent &&
                            <FormHelperText style={{ color: 'red' }}>
                                {translate('events_error_select_event')}
                            </FormHelperText>
                        }
                    </FormControl>
                    <Button
                        style={{
                            marginLeft: '5px',
                            background: selectedEvent ? '#006EFF' : '#afb2ba',
                            color: selectedEvent ? 'white' : 'gray',
                            cursor: selectedEvent ? 'pointer' : 'auto',
                            border: selectedEvent ? '#006EFF' : 'gray',
                        }}
                        onClick={async () => {
                            if (selectedEvent) {
                                await addEvent(selectedEvent)
                                setTriedAddingEvent(false)
                            } else {
                                setTriedAddingEvent(true)
                            }
                        }}
                    >
                        {translate('events_add_event')}
                    </Button>
                </div>
            }
        />
    )
}
