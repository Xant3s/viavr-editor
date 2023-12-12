import { useEffect, useState } from 'react'
import { Checkbox } from '../Utils/UI'
import { Button } from '../StyledComponents/Button'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from 'react-tooltip'
import { SelectMenu } from 'evergreen-ui';

export const UISettings = ({ hidden }) => {

    const [useVariableUI, setUseVariableUI] = useState(false)
    const [variables, setVariables] = useState<string[][]>([])
    const [selectedVariables, setSelectedVariables] = useState<any[]>([])
    const [selectButtonText, setSelectButtonText] = useState<string>('')

    const loadSettings = async () => {
        const variableUIEnabledSetting = (await api.invoke(api.channels.toMain.getBuildSetting, 'variableUIEnabled')) || false
        setUseVariableUI(variableUIEnabledSetting)
    }

    const loadVariables = async () => {
        const loadedVariables = await api.invoke(api.channels.toMain.getBuildSetting, 'variables');
        setVariables(loadedVariables || [])
    }

    useEffect(() => {
        if (hidden) return
        loadSettings()
        loadVariables()
    }, [hidden])

    const toggleVariableUI = async () => {
        await api.invoke(api.channels.toMain.setBuildSetting, 'variableUIEnabled', !useVariableUI)
        setUseVariableUI(!useVariableUI)
    }

    const onUpdateSelectedVariables = async (selectedItems) => {
        setSelectedVariables(selectedItems)
        setSelectButtonText(calculateSelectButtonText(selectedItems))
        await api.invoke(api.channels.toMain.setBuildSetting, 'variableUI', selectedItems)
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

    return <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
                id={'useVariableUI'}
                checked={useVariableUI}
                onChange={() => toggleVariableUI()}
                label={'Use variable UI'}
            />
            <HelpOutlineIcon
                data-tooltip-id="my-tooltip"
                data-tooltip-html={'Whether to use a UI that displays variable values'}
                data-tooltip-place="right"
                style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }}
            />
        </div>
        <Tooltip id="my-tooltip" />
        {
            useVariableUI && <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SelectMenu
                        isMultiSelect
                        title="Select tags"
                        options={variables.map(variable => ({ label: variable[0], value: variable[0], }))}
                        selected={selectedVariables}
                        onSelect={async item => {
                            await onUpdateSelectedVariables([...selectedVariables, item.value])
                        }}
                        onDeselect={async item => {
                            const deselectedItemIndex = selectedVariables.indexOf(item.value)
                            const selectedItems = selectedVariables.filter((_item, i) => i !== deselectedItemIndex)
                            await onUpdateSelectedVariables(selectedItems)
                        }}
                    >
                        <Button>{selectButtonText || 'Select variables to show in VR...'}</Button>
                    </SelectMenu>
                </div>
            </>
        }
    </>
}