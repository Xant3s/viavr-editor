import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu } from 'evergreen-ui'
import { useState } from 'react'

export const MetaDataEditor = () => {
    const [options] = useState(["Avatar", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map((label) => ({ label, value: label, })))
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObject, setSelectedObject] = useState<string>('')
    const [selectedTagsState, setSelectedTags] = useState<any[]>([])
    const [selectedTagsNamesState, setSelectedTagsNames] = useState<string>('')


    const updateTagSettings = async (selectedItems) => {
        const selectedNames = createSelectedNames(selectedItems)

        setSelectedTags(selectedItems)
        setSelectedTagsNames(selectedNames)

        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        tags[selectedObject] = selectedItems
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', tags)
    }

    const onSelectChange = async (value) => {
        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        const objectTags = tags[value] ?? []
        const selectedNames = createSelectedNames(objectTags)
        setSelectedObject(value)
        setSelectedTags(objectTags)
        setSelectedTagsNames(selectedNames)
    }

    const loadSceneObjects = async () => {
        const objects = await api.invoke(api.channels.toMain.getSceneObjects)
        setSceneObjects(objects)
        onSelectChange(objects[0].uuid)
    }

    function createSelectedNames(selectedItems: any[]) {
        let selectedNames = ''
        const selectedItemsLength = selectedItems.length
        if (selectedItemsLength === 0) {
            selectedNames = ''
        } else if (selectedItemsLength === 1) {
            selectedNames = selectedItems.toString()
        } else if (selectedItemsLength > 1) {
            selectedNames = selectedItemsLength.toString() + ' selected...'
        }
        return selectedNames
    }

    return <SettingAccordion summary={'Meta Data'} details={(
        <div>
            <Button onClick={() => {
                loadSceneObjects()
            }}>Load Objects</Button>

            <Select style={{ backgroundColor: "white" }} id="sceneObject" onChange={event => onSelectChange(event.target.value)} required>
                {sceneObjects.map((object, index) => (
                    <option key={index} value={object.uuid}>
                        {object.name}
                    </option>
                ))}
            </Select>

            <SelectMenu
                isMultiSelect
                title="Select tags"
                options={options}
                selected={selectedTagsState}
                onSelect={(item) => {
                    const selected = [...selectedTagsState, item.value]
                    const selectedItems = selected
                    updateTagSettings(selectedItems)
                }}
                onDeselect={(item) => {
                    const deselectedItemIndex = selectedTagsState.indexOf(item.value)
                    const selectedItems = selectedTagsState.filter((_item, i) => i !== deselectedItemIndex)
                    updateTagSettings(selectedItems)
                }}
            >
                <Button>{selectedTagsNamesState || 'Select tags...'}</Button>
            </SelectMenu>
        </div>
    )} />
}
