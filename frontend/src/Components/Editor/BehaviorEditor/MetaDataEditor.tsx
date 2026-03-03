import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Select, SelectMenu, Pane } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip } from 'react-tooltip'
import { Meta } from '../../../@types/Behaviors'
import { FormControl, FormHelperText } from '@mui/material'
import MetaDataComponent from './MetaDataComponent'
import { useTranslation } from '../../../LocalizationContext'

const RECOMMENDED_TAGS = [
    "Avatar",
    "Floor",
    "Teleport Anchor",
    "Collectable",
    "Level Boundary: Lower Left",
    "Level Boundary: Upper Right"
]

export const MetaDataEditor = ({ isActive }) => {
    const { translate } = useTranslation()
    const [allTags, setAllTags] = useState<{ label: string, value: string }[]>([])
    const [availableTags, setAvailableTags] = useState<{ label: string, value: string }[]>([])
    const [sceneObjects, setSceneObjects] = useState<any[]>([])
    const [selectedObjectUUID, setSelectedObjectUUID] = useState<string>('')
    const [selectButtonText, setSelectButtonText] = useState<string>('')
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const [triedAddingMeta, setTriedAddingMeta] = useState<boolean>()
    const [metas, setMetas] = useState<Meta[]>([])

    const saveObjectTags = async (newMetas: Meta[]) => {
        // Create objectTags from metas
        const objectTags = {}
        newMetas.forEach(meta => {
            objectTags[meta.uuid] = meta.tags
        })
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', objectTags)
        await api.invoke(api.channels.toMain.setBuildSetting, 'metas', newMetas)
    }

    const onUpdateSelectedObject = async (uuid: string) => {
        const tags = await api.invoke(api.channels.toMain.getBuildSetting, 'objectTags') ?? {}
        const objectTags: string[] = tags[uuid] ?? []
        setSelectedObjectUUID(uuid)
        setSelectedTags(objectTags)
        setSelectButtonText(calculateSelectButtonText(objectTags))
        await calculateAvailableTags(uuid)
    }

    const onUpdateSelectedTags = async (selectedItems: string[]) => {
        setSelectedTags(selectedItems)
        setSelectButtonText(calculateSelectButtonText(selectedItems))
    }

    function calculateSelectButtonText(selectedItems: any[]) {
        const selectedItemsLength = selectedItems.length
        let selectedNames = ''
        if (selectedItemsLength === 1) {
            selectedNames = selectedItems.toString()
        } else if (selectedItemsLength > 1) {
            selectedNames = `${selectedItemsLength.toString()} ${translate('meta_editor_select_tags_button_default')}`
        }
        return selectedNames
    }

    const calculateAvailableTags = async (objectUUID: string, currentOptions = allTags) => {
        const selectedObj = sceneObjects.find(sceneObj => objectUUID === sceneObj.uuid)
        if (!selectedObj) return

        const objName = selectedObj.name
        const obj = metas.find(meta => objName === meta.name)

        if (obj !== undefined) {
            const unavailableTags: any = obj.tags
            const calculatedAvailableTags = currentOptions.filter(tag => !unavailableTags.includes(tag.value))
            setAvailableTags(calculatedAvailableTags)
        }
        else {
            setAvailableTags(currentOptions)
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
        })
        await api.invoke(api.channels.toMain.setBuildSetting, 'objectTags', tags)
    }

    const loadMetas = async () => {
        const loadedMetas = await api.invoke(api.channels.toMain.getBuildSetting, 'metas') ?? [];
        setMetas(loadedMetas)
    }

    const loadProjectTags = async () => {
        const settings = await api.invoke(api.channels.toMain.requestProjectSettings) as [string, any][]
        const tagsSetting = settings.find(s => s[0] === 'tags')?.[1]
        const projectTags: string[] = tagsSetting?.value ?? []
        const mergedTags = Array.from(new Set([...RECOMMENDED_TAGS, ...projectTags]))
        const tagOptions = mergedTags.map(tag => ({ label: tag, value: tag }))
        setAllTags(tagOptions)
        setAvailableTags(tagOptions)
    }

    const addMeta = async (tags: string[]) => {
        let objectUUID = selectedObjectUUID
        if(!objectUUID && sceneObjects.length > 0) {
            objectUUID = sceneObjects[0].uuid
            setSelectedObjectUUID(objectUUID)
        }

        if(!objectUUID) return

        const selectedObj = sceneObjects.find(sceneObj => objectUUID === sceneObj.uuid)
        if(!selectedObj) return

        const metaObjName: string = selectedObj.name
        const object = metas.find(metaObj => metaObjName === metaObj.name)

        let newMetas: Meta[]
        if (object !== undefined) {
            const updatedObjTags: any = [...object.tags, ...tags]
            const newMetaObj: Meta = { uuid: objectUUID, name: metaObjName, tags: updatedObjTags, index: object.index }
            const updatedMetas = [...metas.filter(meta => meta["name"] !== metaObjName), newMetaObj]
            newMetas = [...updatedMetas.sort((m1, m2) => m1.index - m2.index)]
        }
        else {
            newMetas = [...metas, { uuid: objectUUID, name: metaObjName, tags: tags, index: metas.length }]
        }
        setMetas(newMetas)

        await onUpdateSelectedTags([])

        const updatedAvailableTags = availableTags.filter(tag => !tags.includes(tag.value))
        setAvailableTags(updatedAvailableTags)

        await saveObjectTags(newMetas)
    }

    const removeMeta = async (name: string) => {
        const newMetas = metas.filter(meta => meta["name"] !== name)
        setMetas(newMetas)
        setAvailableTags(allTags)
        await saveObjectTags(newMetas)
    }

    const removeTag = async (metaObj: Meta, tag) => {
        if (metaObj.tags.length <= 1) {
            await removeMeta(metaObj.name)
            return
        }

        const updatedTags: any = [...metaObj.tags.filter(tagName => tagName !== tag)]
        const newMetaObj: Meta = { uuid: metaObj.uuid, name: metaObj.name, tags: updatedTags, index: metaObj.index }

        const updatedMetas = [...metas.filter(meta => meta["name"] !== metaObj.name), newMetaObj]
        const sortedMetas = [...updatedMetas.sort((m1, m2) => m1.index - m2.index)]

        setMetas(sortedMetas)

        const updatedAvailableTags = [...availableTags, { label: tag, value: tag }]
        setAvailableTags(updatedAvailableTags)

        await saveObjectTags(sortedMetas)
    }

    useEffect(() => {
        if (isActive) {
            loadSceneObjects()
            loadMetas()
            loadProjectTags()
        }
    }, [isActive])

    useEffect(() => {
        const listenerId = api.on(api.channels.fromMain.projectSettingChanged, (data: { uuid: string, newValue: any }) => {
            if (data.uuid === 'eec34978-5532-43b4-ae66-75d3deacc6cf') {
                const projectTags: string[] = data.newValue ?? []
                const mergedTags = Array.from(new Set([...RECOMMENDED_TAGS, ...projectTags]))
                const tagOptions = mergedTags.map(tag => ({ label: tag, value: tag }))
                setAllTags(tagOptions)
                if (selectedObjectUUID) {
                    calculateAvailableTags(selectedObjectUUID, tagOptions)
                } else {
                    setAvailableTags(tagOptions)
                }
            }
        })

        return () => {
            api.removeListener(api.channels.fromMain.projectSettingChanged, listenerId)
        }
    }, [selectedObjectUUID])

    return <SettingAccordion
        summary={
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ margin: '0px', padding: '0px' }}>{translate('meta_editor_summary_meta_data')}</span>
                <HelpOutlineIcon
                    data-tooltip-id="Variables"
                    data-tooltip-content={translate('meta_editor_tooltip_info')}
                    style={{ marginLeft: 5, fontSize: 14 }}
                />
                <Tooltip id="Variables" place="right" style={{ fontSize: '14px', maxWidth: '300px', whiteSpace: 'normal' }} />
            </span>
        }
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
                        <MetaDataComponent meta={meta} OnClose={() => removeMeta(meta["name"])} removeTagFunction={removeTag} />
                    </Pane>
                ))}
                <Select style={{ backgroundColor: "white" }} value={selectedObjectUUID} onChange={e => onUpdateSelectedObject(e.target.value)} required>
                    {sceneObjects.map((object, index) => (
                        <option key={index} value={object.uuid}>
                            {object.name}
                        </option>
                    ))}
                </Select>
                <FormControl>
                    <SelectMenu
                        isMultiSelect
                        title={translate('meta_editor_select_tags_title')}
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
                        <Button>{selectButtonText || translate('meta_editor_select_tags_button_default')}</Button>
                    </SelectMenu>
                    {triedAddingMeta && (selectedTags.length === 0) && <FormHelperText style={{ color: 'red' }}>{translate('meta_editor_error_select_tag')}</FormHelperText>}
                </FormControl>
                <Button
                    style={{
                        marginLeft: '5px',
                        background: (selectedTags.length > 0) ? '#006EFF' : '#afb2ba',
                        color: (selectedTags.length > 0) ? 'white' : 'gray',
                        cursor: (selectedTags.length > 0) ? 'pointer' : 'auto',
                        border: (selectedTags.length > 0) ? '#006EFF' : 'gray',
                    }}
                    onClick={async () => {
                        if (selectedTags.length > 0) {
                            await addMeta(selectedTags)
                            setTriedAddingMeta(false)
                        }
                        else {
                            setTriedAddingMeta(true)
                        }
                    }}>
                    {translate('meta_editor_add_tags')}
                </Button>
            </div>
        )} />
}
