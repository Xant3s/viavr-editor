import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu, IconButton, CrossIcon, Pane } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { Meta } from '../../../@types/Behaviors'
import MetaDataComponent from './MetaDataComponent'

export const MetaDataEditor = ({isActive}) => {
    const [options] = useState(["Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label })))
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObject, setSelectedObject] = useState<any>({})
    const [selectButtonText, setSelectButtonText] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<any[]>([])

    const [metas, setMetas] = useState<Meta[]>([])
    // maybe not needed:
    const [meta, setMeta] = useState<string>('')

    let objectName

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

        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        // Filter out tags that don't have a corresponding uuid property in any object anymore, since the object was deleted
        Object.keys(tags).forEach((key, index) => {
          if (!objects.some(object => object.uuid === key)) {
            delete tags[key]
          }
        });
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', tags)
    }

    const addMeta = async (tags) => {
        // Add Meta Data a la Add Event Behvaior
        // --> Object Name at top
        // --> list of tags below

        let objectName
        for(let i = 0; i < sceneObjects.length; i++){
            if(selectedObject === sceneObjects[i].uuid){
                objectName = sceneObjects[i].name
            }
        }
        
        for(let i = 0; i < metas.length; i++){
            if(objectName === metas[i].name){
                return
            }
        }

        setMetas([...metas, {name: objectName, tags: tags}]) 
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', selectedTags)

        // --> check if Object already added
        // --> check if tag already added
    }

    const removeMeta = async (name) => {
        // --> remove either whole object or just tag
        // --> depending on which cross was clicked 
        setMetas(metas.filter(meta => meta["name"] !== name));
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', metas)
    }

    async function updateMeta(meta){
        const updatedMetas = metas.map((obj) => {
            return obj.name === meta.name ? meta : obj;
            })

        setMetas(updatedMetas)
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', metas)
    }

    useEffect(() => {
        if(isActive) loadSceneObjects()
    }, [isActive])

    return <SettingAccordion summary={'Meta Data'} details={(
        <div>
            {metas.map((meta, index) => (
                <Pane
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                marginBottom={8}
            >
                <MetaDataComponent meta={meta} callback={updateMeta} />
                <IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => removeMeta(meta["name"])} />
            </Pane>
            ))}
            <Select style={{ backgroundColor: "white" }} value={selectedObject} onChange={e => onUpdateSelectedObject(e.target.value)} required>
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
            <Button onClick={() => addMeta(selectedTags)}> Add Meta </Button>
        </div>
    )} />
}
