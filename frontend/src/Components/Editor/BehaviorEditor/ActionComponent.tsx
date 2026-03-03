import { Button, Pane, SelectMenu, TextInput, DragHandleVerticalIcon, Select } from 'evergreen-ui'
import { Action, Parameter } from '../../../@types/Behaviors'
import { useCallback, useEffect, useState } from 'react'
import { SettingAccordionAction } from '../../Settings/SettingAccordion'
import { useTranslation } from '../../../LocalizationContext'

interface Props {
    action: Action | undefined
    availableActions: Action[]
    sceneObjects: any[]
    updateAction: (newAction: Action | undefined) => void
    deleteActionComponent: () => void
}

const RECOMMENDED_TAGS = [
    "Avatar",
    "Floor",
    "Teleport Anchor",
    "Collectable",
    "Grab",
    "Level Boundary: Lower Left",
    "Level Boundary: Upper Right"
]

const ActionComponent = (props: Props) => {
    const { translate } = useTranslation()
    const [actionOptions, setActionOptions] = useState(props.availableActions.map(action => ({ label: action.displayName, value: action.name })))
    const [allTags, setAllTags] = useState<{ label: string, value: string }[]>([])

    function selectAction(actionName: string) {
        const action = props.availableActions.find(action => action.name === actionName)
        props.updateAction(action)
    }

    function updateParameter(param: Parameter, value: string) {
        if(props.action === undefined) return
        const newAction = props.action
        const parameter = newAction.parameters.find(parameter => parameter.name === param.name)
        if(parameter !== undefined) {
            parameter.value = value
        }
        props.updateAction(newAction)
    }

    const loadProjectTags = useCallback(async () => {
        const settings = await api.invoke(api.channels.toMain.requestProjectSettings) as [string, any][]
        const tagsSetting = settings.find(s => s[0] === 'tags')?.[1]
        const projectTags: string[] = tagsSetting?.value ?? []
        const mergedTags = Array.from(new Set([...RECOMMENDED_TAGS, ...projectTags]))
        const tagOptions = mergedTags.map(tag => ({ label: tag, value: tag }))
        setAllTags(tagOptions)
    }, [])

    useEffect(() => {
        setActionOptions(props.availableActions.map(action => ({ label: action.displayName, value: action.name })))
    }, [props.availableActions])

    useEffect(() => {
        loadProjectTags()

        const listenerId = api.on(api.channels.fromMain.projectSettingChanged, (data: { uuid: string, newValue: any }) => {
            if (data.uuid === 'eec34978-5532-43b4-ae66-75d3deacc6cf') {
                const projectTags: string[] = data.newValue ?? []
                const mergedTags = Array.from(new Set([...RECOMMENDED_TAGS, ...projectTags]))
                const tagOptions = mergedTags.map(tag => ({ label: tag, value: tag }))
                setAllTags(tagOptions)
            }
        })

        return () => {
            api.removeListener(api.channels.fromMain.projectSettingChanged, listenerId)
        }
    }, [loadProjectTags])

    return (
        <SettingAccordionAction
            summary={
                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <DragHandleVerticalIcon style={{ marginRight: '5px' }}></DragHandleVerticalIcon>
                    {translate('action_component_summary')}
                </div>
            }
            onClose={() => props.deleteActionComponent()}
            details={
                <Pane
                    padding={20}
                    border="hidden"
                    marginBottom={20}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <SelectMenu
                        title={translate('action_component_select_action_title')}
                        options={actionOptions}
                        selected={props.action?.displayName}
                        onSelect={item => selectAction(item.value as string)}
                        onDeselect={_ => selectAction('')}
                    >
                        <Button>{props.action?.displayName || translate('action_component_select_action_placeholder')}</Button>
                    </SelectMenu>
                    {props.action?.parameters?.map((parameter, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }} >
                            <div style={{ textAlign: 'left', float: 'left', marginLeft: '15px', width: '180px' }}>
                                <p>
                                    {parameter["name"]}
                                </p>
                            </div>
                            {parameter["name"] === 'gameObject' || parameter["name"] === 'other' ? (
                                <div>
                                    <Select value={parameter.value} onChange={e => updateParameter(parameter, e.target.value)} required>
                                        {props.sceneObjects.map((object, index) => (
                                            <option key={index} value={object.uuid}>
                                                {object.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            ) : (parameter["name"] === 'tag' ? (
                                <div>
                                    <Select value={parameter.value} onChange={e => updateParameter(parameter, e.target.value)} required>
                                        {allTags.map((object, index) => (
                                            <option key={index} value={object.value}>
                                                {object.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            ) :
                                // Render text input for other parameters
                                <TextInput
                                    width={'60%'}
                                    type="text"
                                    placeholder={translate('action_component_parameter_placeholder')}
                                    value={parameter["value"]}
                                    onChange={(e) => updateParameter(parameter, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </Pane>
            }
        />
    )
}

export default ActionComponent
