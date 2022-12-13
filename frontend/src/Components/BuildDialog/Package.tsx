import {Checkbox} from '../Utils/UI'

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

export const Package = ({name, displayName, version, description, isSelected, mandatory, toggleFunction}: IPackage) => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Checkbox id={name}
                      title={description}
                      checked={mandatory || isSelected}
                      onChange={() => toggleFunction(name)}
                      disabled={mandatory}
                      label={displayName}
            />
            <span title={description} style={{paddingLeft: '10px', color: 'gray'}}>{version}</span>
        </div>
    )
}
