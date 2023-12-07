import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu, IconButton, CrossIcon, Pane } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { Meta } from '../../../@types/Behaviors'
import MetaDataComponent from './MetaDataComponent'

export const MetaDataEditor = ({isActive}) => {
    const [options] = useState(["Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label })))
    const [availableTags, setAvailableTags] = useState(["Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label }))) // --> options
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObject, setSelectedObject] = useState<any>({})
    const [selectButtonText, setSelectButtonText] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<any[]>([])

    const [metas, setMetas] = useState<Meta[]>([])

    const onUpdateSelectedObject = async value => {
        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        const objectTags = tags[value] ?? []
        setSelectedObject(value)
        setSelectedTags(objectTags)
        setSelectButtonText(calculateSelectButtonText(objectTags))
        calculateAvailableTags(value)
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

    const calculateAvailableTags = async (object) => {
        //let objName

        const objName = sceneObjects.find(sceneObj => object === sceneObj.uuid).name

        const obj = metas.find(meta => objName === meta.name)

        if(obj !== undefined){
            const unavailableTags : any = obj.tags
            const calculatedAvailableTags = options.filter(tag => !unavailableTags.includes(tag.value))
            setAvailableTags(calculatedAvailableTags)
            await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', unavailableTags)
        }
        else{
            setAvailableTags(options)
        }
        
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
       
        if(tags.length === 0){
            console.log("No Tags selected")
            return
        }

        //default object
        let objectName = sceneObjects[0].name
        if(!(JSON.stringify(selectedObject) === '{}')){
            objectName = sceneObjects.find(sceneObj => selectedObject === sceneObj.uuid).name
        }

        const object = metas.find(metaObj => objectName === metaObj.name)

        if(object !== undefined) {
            const newTags : any = [...object.tags, ...tags]
            const newMeta : Meta = {name: objectName, tags: newTags}

            const updatedMetas = [...metas.filter(meta => meta["name"] !== objectName), newMeta]
            setMetas(updatedMetas)
        }
        else{
            setMetas([...metas, {name: objectName, tags: tags}]) 
        }

        onUpdateSelectedTags([])
        
        
        const updatedTags = availableTags.filter(tag => !tags.includes(tag.value))
        setAvailableTags(updatedTags)

        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', tags)
    }

    const removeMeta = async (name) => {
        setMetas(metas.filter(meta => meta["name"] !== name));
        setAvailableTags(options)
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', metas)
    }

    const removeTag = async (object : Meta, tag) => {
        if(object.tags.length <= 1){
            removeMeta(object.name)
            return
        }
        
        const updatedTags : any = [...object.tags.filter(tagName => tagName !== tag)]
        const newMeta : Meta = {name: object.name, tags : updatedTags}
        const updatedMetas = [...metas.filter(meta => meta["name"] !== object.name), newMeta]

        setMetas(updatedMetas)

        const updatedAvailableTags = [...availableTags, {label: tag, value: tag}]
        setAvailableTags(updatedAvailableTags)

        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', object.tags)
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
                <MetaDataComponent meta={meta} callback={updateMeta} removeTagFunction = {removeTag} />
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
                options={availableTags}
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
