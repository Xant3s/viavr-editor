import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Checkbox, CrossIcon, IconButton, Pane, Select, SelectMenu, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import EventComponent from './EventComponent'
import { Action, Event, Parameter, eventTypes } from '../../../@types/Behaviors'

// TODO import useEffect and load actions there. Similar to this:
// useEffect(() => {
//     if(hidden) return
//     loadScenes()
//     loadPackages()
// }, [hidden])

export let actions: Action[] = []
export let availableEvents: Event[] = []

export const EventsEditor = () => {
    const [options, setOptions] = useState(availableEvents.map(event => ({ label: event.name, value: event.name })))

    const [events, setEvents] = useState<Event[]>([]);
    const [event, setEvent] = useState<string>('')
    const [eventButtonText, setEventButtonText] = useState<string>('')


    useEffect(() => {
        loadActions()
        loadEvents()
    })

    async function loadActions() {
        const packages = await api.invoke(api.channels.toMain.queryPackages)

        // Example result of query for development/testing
        // const packages = JSON.parse('[{"author":{"name":"Games Engineering JMU Würzburg","url":"https://games.uni-wuerzburg.de"},"description":"A set of utilities that help build Unity projects. Features include helper scripts for building from the command line, executing pre- and post-build actions, or starting the build process faster from the editor menu using predefined configurations.","documentationUrl":"https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/build-utils/-/wikis/home","displayName":"Build Utils","name":"de.jmu.ge.buildutils","unity":"2020.1","unityRelease":"0f1","version":"0.6.3","hideInEditor":false,"dependencies":{"de.jmu.ge.viavr.unitybridge":"0.1.0","com.unity.xr.management":"4.0.1"},"keywords":["viavr"],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"mandatory":true,"gitHead":"95f7a008797bfe28c262b9ac85759cb021ac39b7","_id":"de.jmu.ge.buildutils@0.6.3","_nodeVersion":"16.20.0","_npmVersion":"8.19.4","dist":{"integrity":"sha512-jlAU5Jff5Sv5b7NK7tAsdPngZp2zd5Rb5Bwy3fzAw4mQfDaQ731imx9xwvxpflZyN+Ye7eqXlT9BOVDUc1JPEw==","shasum":"94f45f4222a467043c7ad74e00d3186c392f740d","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.buildutils/-/de.jmu.ge.buildutils-0.6.3.tgz"},"contributors":[],"actions":[{"name":"Test-Action1","parameters":[]}]},{"author":{"name":"Games Engineering JMU Würzburg","url":"https://games.uni-wuerzburg.de"},"description":"A set of fire triggers for Virtual Reality Exposure Therapy.","documentationUrl":"","displayName":"Fire Triggers","name":"de.jmu.ge.firetriggers","unity":"2020.1","unityRelease":"0f1","version":"0.0.1-test2","hideInEditor":false,"dependencies":{},"keywords":["viavr"],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"mandatory":false,"triggers":[{"name":"trigger1","values":["alt1","alt2"]}],"gitHead":"0fcadd1e9ff0438db8d6c2c6d2b62fa2b19a87a7","_id":"de.jmu.ge.firetriggers@0.0.1-test2","_nodeVersion":"16.19.0","_npmVersion":"8.19.3","dist":{"integrity":"sha512-cuQjOQA+VpH9u2zm/NT2Wz/mxj5gPWBSbmv6ynsx2Q1JxgtSc3Uz8Yg9E8xTdM8CqlJFHFNeOKXrHfPzbykDfw==","shasum":"805b4d8c043aa09b6c755fdf3307fdd47acffa3f","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.firetriggers/-/de.jmu.ge.firetriggers-0.0.1-test2.tgz"},"contributors":[],"actions":[{"name":"Test-Action2","parameters":[{"name":"Test-Parameter","type":"string","value":""}]},{"name":"Test-Action3","parameters":[]}]},{"author":{"name":"Games Engineering JMU Würzburg","url":"https://games.uni-wuerzburg.de"},"description":"Displays game states (scriptable objects) in a prefabricated UI.","documentationUrl":"https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/gamification-utils/-/wikis/home","displayName":"Gamification Utils","name":"de.jmu.ge.gamificationutils","unity":"2020.1","unityRelease":"0f1","version":"0.1.0","hideInEditor":false,"mandatory":false,"dependencies":{"de.jmu.ge.viavr.unitybridge":"0.1.1"},"samples":[{"displayName":"Simple Example","description":"Simple Gamification Sample","path":"Samples~/Simple Gamification Sample"}],"keywords":["viavr"],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"configDescription":{"labels":{"value":[{"name":{"value":"Playtime","uuid":"02c7a696-4bee-4ec2-9b9b-7d9c50ad49e9","kind":"string","label":"Name"},"fontSize":{"value":"20","uuid":"a499b2d8-abd0-451b-9674-d6c8f38507b6","kind":"int","label":"Font Size"},"fontColor":{"value":"red","uuid":"b185e84e-a3b1-4763-bfac-27201f409715","kind":"string","label":"Font Color"},"position":{"value":"top_left","uuid":"bbf7a889-f128-4886-9f49-85b82fe8990a","kind":"dropdown","label":"Position","options":["top_left","top_right","bottom_left","bottom_right"]}}],"uuid":"4cc4b44f-3978-4c45-b79f-e1e5264df7bd","kind":"list","listType":"composite","label":"Labels"},"states":{"value":[{"name":{"value":"Playtime","uuid":"00b79c08-1b26-42de-95ec-780bcd3d15a4","kind":"string","label":"Name"},"value":{"value":"0","uuid":"5a1c1508-1383-48d7-92e3-f4c78084c889","kind":"int","label":"Value"}}],"uuid":"a68e91fa-ee79-484e-b80b-cf7cd1e485b0","kind":"list","listType":"composite","label":"States"}},"gitHead":"1be6bd94f8db5cf6e9fa3f2bf2c1991d74ac0353","_id":"de.jmu.ge.gamificationutils@0.1.0","_nodeVersion":"16.14.2","_npmVersion":"8.4.1","dist":{"integrity":"sha512-K0ALz9rLiW8MSfg/aq5FWJUqj7EiSbWNIub7P6ONO1oneC1xAq0U3DrgsaM5H2pZTn3eR4PCSOFp9WijO3rklQ==","shasum":"ffe4c0d81a56578e29df34a804e77629644117a1","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.gamificationutils/-/de.jmu.ge.gamificationutils-0.1.0.tgz"},"contributors":[]},{"name":"de.jmu.ge.logicengine","version":"1.0.7","displayName":"Logic Engine","description":"The system handling the Unity side of the logic engine for the VIA-VR platform","documentationUrl":"https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/de.jmu.ge.logicengine/-/blob/master/README.md","unity":"2020.1","author":{"name":"Games Engineering JMU Würzburg","url":"https://games.uni-wuerzburg.de"},"hideInEditor":false,"mandatory":true,"dependencies":{"de.jmu.ge.spokesceneimporter":"0.3.3","de.jmu.ge.viavr.unitybridge":"0.4.0","com.unity.nuget.newtonsoft-json":"3.0.2","com.unity.xr.core-utils":"2.0.0","com.unity.xr.interaction.toolkit":"2.2.0","unity-com.siccity.gltfutility":"0.7.2"},"samples":[{"displayName":"Example Scenes","description":"Simple Logic Engine Example Scenes","path":"Samples~/LogicEngineSampleScenes"}],"keywords":["viavr"],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"gitHead":"1e00c86d2d8e60998abe25b9a9174a56f6bd71c3","_id":"de.jmu.ge.logicengine@1.0.7","_nodeVersion":"16.20.0","_npmVersion":"8.19.4","dist":{"integrity":"sha512-UwQ/tkVA3M6unywA65RGTS5+KTu3GSocilhRsjBehnPR/OL5SNm9dckWPmqQOCP5u/Slw9B8CJkUnZgb4CiOLA==","shasum":"49929ccd0cb0e29347ba222a2721c2eb39d85089","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.logicengine/-/de.jmu.ge.logicengine-1.0.7.tgz"},"contributors":[]},{"author":{"name":"Games Engineering JMU Würzburg"},"description":"A tool to transform binary GLTF scenes exported from Spoke into Unity scenes","documentationUrl":"https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/README.md","displayName":"Spoke Scene Importer","name":"de.jmu.ge.spokesceneimporter","unity":"2020.1","unityRelease":"0f1","version":"0.3.3","hideInEditor":false,"keywords":["viavr"],"mandatory":true,"dependencies":{"de.jmu.ge.viavr.unitybridge":"0.4.0","unity-com.siccity.gltfutility":"0.7.2"},"samples":[{"displayName":"First Example","description":"A simple example demonstrating the import of two scenes","path":"Samples~/FirstExample"}],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"gitHead":"0ea669c7f6aa245ffbb8b1e2c09b7b73a3495eeb","_id":"de.jmu.ge.spokesceneimporter@0.3.3","_nodeVersion":"16.20.0","_npmVersion":"8.19.4","dist":{"integrity":"sha512-+VfHS6OhkkpZ1x0PfIrzhDCD9TVBh5qGNuri08Di5GhpUY7N36P+l+GCZ3EfpwjXeDgG3YN5ZWbDNWFqRyLvyg==","shasum":"54563c85eeeea8182832e3e06c96bd59af002c79","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.spokesceneimporter/-/de.jmu.ge.spokesceneimporter-0.3.3.tgz"},"contributors":[]},{"author":{"name":"Games Engineering JMU Würzburg"},"description":"This package provides an automatic Locomotion importer, that can read in settings for different movements","displayName":"Locomotion","name":"de.jmu.ge.viavr.locomotion","unity":"2021.2","unityRelease":"0f1","version":"0.3.0","hideInEditor":false,"keywords":["viavr"],"mandatory":true,"dependencies":{"de.jmu.ge.viavr.unitybridge":"0.1.0","com.unity.xr.interaction.toolkit":"2.0.0","com.unity.inputsystem":"1.2.0"},"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"configDescription":{"extendedWalking":{"value":{"active":{"value":"true","uuid":"2e5a6b8d-23e8-41e1-8c7b-d416851b0f66","kind":"boolean","label":"Active"},"gravityBased":{"value":"false","uuid":"f665fb54-7b76-4415-a592-4a91ea320165","kind":"boolean","label":"Gravity-based"},"movementExtension":{"value":"3.0","uuid":"7bb6384f-68a1-4c2b-a371-54fed1c87513","kind":"float","label":"Extended Movement Factor"}},"uuid":"c85ead3c-85e8-417c-a5a6-aec4ef710a6b","kind":"composite","label":"Extended Walking"},"teleport":{"value":{"active":{"value":"false","uuid":"8017818a-5f8b-4a72-a676-fd48d9e27f7b","kind":"boolean","label":"Active"},"customActions":{"value":"false","uuid":"fa3857a0-c042-4436-8997-e60efe9abe7a","kind":"boolean","label":"Custom Actions"},"teleportVariant":{"value":"Discrete","uuid":"7998dd7f-d197-4954-860a-6f46b3929881","kind":"dropdown","label":"Teleportation Variant","options":["Discrete","Continuos"]},"portableDestinations":{"value":["testCube","testEmpty"],"uuid":"9b0e2e69-3357-465f-a8ff-b25b6e6bff55","kind":"list","listType":"string","label":"Portable Destinations"},"floorNames":{"value":["testArea1","testArea2"],"uuid":"ce461268-971c-46b8-92b2-ba3b5200dabf","kind":"list","listType":"string","label":"Floor Names"},"uuid":"315cf3c8-a28e-4946-8e9a-db3f7c5205fd","kind":"composite","label":"Teleportation Settings"},"uuid":"50aa08eb-ca33-4516-8f1b-eeec762a0f33","kind":"composite","label":"Teleportation Settings"},"thumbStick":{"value":{"active":{"value":"false","uuid":"532e234e-7fbf-483b-b142-c41ee56e7a5e","kind":"boolean","label":"Active"},"customActions":{"value":"false","uuid":"4a14d6ea-0768-4ee6-98ed-ee0d4485d5d3","kind":"boolean","label":"Custom Actions"},"walkingSpeed":{"value":"1","uuid":"b763c012-fa53-45d5-b4aa-1ebfc92c98f2","kind":"float","label":"Walking Speed"}},"uuid":"69a07bcf-89a4-4a35-8bea-e83f7c4c7592","kind":"composite","label":"Thumbstick Settings"},"leftHanded":{"value":"false","uuid":"b40479b1-ade7-4ac3-80c4-046c03c76f5d","kind":"boolean","label":"Left-handed"}},"gitHead":"76f5a352233e4e1c90169789943241c40414a437","_id":"de.jmu.ge.viavr.locomotion@0.3.0","_nodeVersion":"16.20.0","_npmVersion":"8.19.4","dist":{"integrity":"sha512-D3jdPi5EcIiwYyuwFhr02LePFNCMEmIpUFqA37iFToOV1VaGkkbd7oJ5vd4lQv/yWULA/gFDQictsChPOwGTiQ==","shasum":"b5cccf5603d5f12d530ec8b873a3d3a976125054","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.viavr.locomotion/-/de.jmu.ge.viavr.locomotion-0.3.0.tgz"},"contributors":[]},{"author":{"name":"Games Engineering JMU Würzburg"},"description":"Provides API used by VIA-VR Editor to talk to all VIA-VR packages.","documentationUrl":"https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/via-vr-unity-bridge/-/blob/main/README.md","displayName":"VIA-VR Unity Bridge","name":"de.jmu.ge.viavr.unitybridge","unity":"2020.1","unityRelease":"0f1","version":"0.4.0","hideInEditor":false,"keywords":["viavr"],"mandatory":true,"dependencies":{},"samples":[{"displayName":"Example Unity Package","description":"A simple example showcasing how any Unity package can be used in VIA-VR via the Unity Bridge.","path":"Samples~/SamplePackage"}],"publishConfig":{"registry":"https://packages.informatik.uni-wuerzburg.de/"},"gitHead":"a04107cfc5b524937a3f9ee4f0bce07692802d30","_id":"de.jmu.ge.viavr.unitybridge@0.4.0","_nodeVersion":"16.20.0","_npmVersion":"8.19.4","dist":{"integrity":"sha512-o1G4BiYqECCKdL6/0E0EjFYU2u+DI/x+xPc984tITcqn6I3Pb9m8/Sn9l2x3A5TZtN+q4ZmI1nyLCga9XBMP2A==","shasum":"fb9f984ec5c148f40394704e51a3b11f860a533d","tarball":"http://packages.informatik.uni-wuerzburg.de/de.jmu.ge.viavr.unitybridge/-/de.jmu.ge.viavr.unitybridge-0.4.0.tgz"},"contributors":[]}]')

        const packagesWithActions = packages.filter(item => 'actions' in item)
        let actionList: Action[] = []
        packagesWithActions.forEach(packageWithActions => {
            actionList = actionList.concat(packageWithActions["actions"] as Action[])
        });

        setActions(actionList)
    }

    function setActions(actionList) {
        actions = actionList
    }

    async function loadEvents() {
        const packages = await api.invoke(api.channels.toMain.queryPackages)

        const packagesWithEvents = packages.filter(item => 'events' in item)
        let eventList: Event[] = []
        packagesWithEvents.forEach(packageWithEvents => {
            eventList = eventList.concat(packageWithEvents["events"] as Event[])
        })

        setAvailableEvents(eventList)
    }



function setAvailableEvents(eventList) {
    availableEvents = eventList
    setOptions(availableEvents.map(event => ({ label: event.name, value: event.name })))
}

function setEventAndText(eventName) {
    setEvent(eventName)
    setEventButtonText(eventName)
}

const addEvent = async (type) => {
    const e = availableEvents.find(item => item.name === type)
    if (e !== undefined) {
        e.actionSequence = []
        e.id = Date.now()
        setEvents([...events, e]);
        await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
    }
};

const removeEvent = async (id) => {
    setEvents(events.filter(event => event["id"] !== id));
    await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
};

async function updateEvent(event) {
    const updatedEvents = events.map((obj) => {
        return obj.id === event.id ? event : obj;
    })
    setEvents(updatedEvents)
    await api.invoke(api.channels.toMain.setBuildSetting, 'events', events)
}

return (
    <SettingAccordion
        summary={'Events'}
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
                        <EventComponent event={event} callback={updateEvent} />
                        <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => removeEvent(event["id"])} />
                    </Pane>
                ))}
                <SelectMenu
                    title='Select event'
                    options={options}
                    selected={event}
                    onSelect={item => {
                        setEventAndText(item.value.toString())
                    }}
                    onDeselect={_ => { setEventAndText("") }}
                >
                    <Button>{eventButtonText || 'Select event...'}</Button>
                </SelectMenu>
                <Button onClick={() => {
                    addEvent(event)
                }}>Add Event</Button>
            </div>

        }
    />
)
}
