import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu, IconButton, CrossIcon, Pane } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { Meta } from '../../../@types/Behaviors'
import { FormControl, FormHelperText } from '@mui/material'
import MetaDataComponent from './MetaDataComponent'

export const MetaDataEditor = ({isActive}) => {
    const [options] = useState(["Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label })))
    const [availableTags, setAvailableTags] = useState(["Avatar", "Floor", "Teleport Anchor", "Collectable", "Level Boundary: Lower Left", "Level Boundary: Upper Right"].map(label => ({ label, value: label }))) // --> options
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObject, setSelectedObject] = useState<any>({})
    const [selectButtonText, setSelectButtonText] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const [triedAddingMeta, setTriedAddingMeta] = useState<boolean>()

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

        //default object
        let objectName = sceneObjects[0].name
        if(!(JSON.stringify(selectedObject) === '{}')){
            objectName = sceneObjects.find(sceneObj => selectedObject === sceneObj.uuid).name
        }

        const object = metas.find(metaObj => objectName === metaObj.name)

        // object in list
        if(object !== undefined) {
            const newTags : any = [...object.tags, ...tags]
            const newMeta : Meta = {name: objectName, tags: newTags, index: object.index}

            const updatedMetas = [...metas.filter(meta => meta["name"] !== objectName), newMeta]
            const sortedMetas  = [...updatedMetas.sort((m1, m2) => m1.index - m2.index)]

            setMetas(sortedMetas)
        }
        else{
            setMetas([...metas, {name: objectName, tags: tags, index: metas.length}]) 
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
        const newMeta : Meta = {name: object.name, tags : updatedTags, index: object.index}

        const updatedMetas = [...metas.filter(meta => meta["name"] !== object.name), newMeta]
        const sortedMetas  = [...updatedMetas.sort((m1, m2) => m1.index - m2.index)]

        setMetas(sortedMetas)

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

    return <SettingAccordion 
    summary={'Meta Data'} 
    details={(
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
                <MetaDataComponent meta={meta} callback={updateMeta} OnClose={() => removeMeta(meta["name"])} removeTagFunction = {removeTag} />
                {/*<IconButton icon={CrossIcon} color="muted" cursor="pointer" onClick={() => removeMeta(meta["name"])} />*/}
            </Pane>
            ))}
            <Select style={{ backgroundColor: "white" }} value={selectedObject} onChange={e => onUpdateSelectedObject(e.target.value)} required>
                {sceneObjects.map((object, index) => (
                    <option key={index} value={object.uuid}>
                        {object.name}
                        
                    </option>
                ))}
            </Select>
            <FormControl>
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
            {triedAddingMeta && (selectedTags.length === 0) && <FormHelperText style={{color: 'red'}}>You have to select a tag to add!</FormHelperText>}
            </FormControl>
            <Button 
                style={{marginLeft: '5px',
                background: (selectedTags.length > 0) ? '#006EFF' : '#afb2ba',
                color: (selectedTags.length > 0) ? 'white' : 'gray',
                cursor: (selectedTags.length > 0) ? 'pointer' : 'auto',
                border: (selectedTags.length > 0) ? '#006EFF' : 'gray',}}
                onClick={() => {
                    if(selectedTags.length > 0){
                        addMeta(selectedTags);
                        setTriedAddingMeta(false);
                    }
                    else{
                        setTriedAddingMeta(true);
                    }
                }}> 
                Add Meta 
            </Button>
        </div>
    )} />
}
