import { Checkbox } from '../Utils/UI'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Tooltip} from 'react-tooltip'

type ToggleFunction = (name: string) => void

interface IPackage {
    name: string,
    displayName: string,
    version: string,
    description: string,
    isSelected: boolean,
    mandatory: boolean,
    toggleFunction: ToggleFunction
}

export const Package = ({
                            name,
                            displayName,
                            version,
                            description,
                            isSelected,
                            mandatory,
                            toggleFunction,
                        }: IPackage) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox id={name}
                      checked={mandatory || isSelected}
                      onChange={() => toggleFunction(name)}
                      disabled={mandatory}
                      label={displayName}
            />
            <span title={description} style={{ paddingLeft: '10px', color: 'gray' }}>{version}</span>
            <div>
            <HelpOutlineIcon data-tooltip-id="my-tooltip" data-tooltip-html={description} data-tooltip-place="top" style={{ color: '#006EFF', marginLeft: 10, fontSize: 16 }}/>
            </div>
            <Tooltip id="my-tooltip"/>
        </div>
    )
}
