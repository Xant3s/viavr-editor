import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu } from 'evergreen-ui'
import { useEffect, useState } from 'react'

export const MetaDataEditor = ({isActive}) => {
    const [options] = useState(["Avatar", "Floor", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label, })))
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObject, setSelectedObject] = useState<any>({})
    const [selectButtonText, setSelectButtonText] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<any[]>([])


    const onUpdateSelectedObject = async value => {
        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        const objectTags = tags[value] ?? []
        setSelectedObject(value)
        setSelectedTags(objectTags)
        setSelectButtonText(calculateSelectButtonText(objectTags))
    }

    const onUpdateSelectedTags = async (selectedItems) => {
        setSelectedTags(selectedItems)
        setSelectButtonText(calculateSelectButtonText(selectedItems))
        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        tags[selectedObject] = selectedItems
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', tags)
    }

    function calculateSelectButtonText(selectedItems: any[]) {
        const selectedItemsLength = selectedItems.length
        let selectedNames = ''
        if(selectedItemsLength === 1) {
            selectedNames = selectedItems.toString()
        } else if(selectedItemsLength > 1) {
            selectedNames = `${selectedItemsLength.toString()} selected...`
        }
        return selectedNames
    }

    const loadSceneObjects = async () => {
        const objects = await api.invoke(api.channels.toMain.getSceneObjects)
        setSceneObjects(objects)
    }

    useEffect(() => {
        if(isActive) loadSceneObjects()
    }, [isActive])

    return <SettingAccordion summary={'Meta Data'} details={(
        <div>
            <Select style={{ backgroundColor: "white" }} value={selectedObject.name} onChange={e => onUpdateSelectedObject(e.target.value)} required>
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
                selected={selectedTags}
                onSelect={async item => {
                    await onUpdateSelectedTags([...selectedTags, item.value])
                }}
                onDeselect={async item => {
                    const deselectedItemIndex = selectedTags.indexOf(item.value)
                    const selectedItems = selectedTags.filter((_item, i) => i !== deselectedItemIndex)
                    await onUpdateSelectedTags(selectedItems)
                }}
            >
                <Button>{selectButtonText || 'Select tags...'}</Button>
            </SelectMenu>
        </div>
    )} />
}
