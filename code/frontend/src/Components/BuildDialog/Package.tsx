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
        <div>
            <input id={name} type={'checkbox'} title={description} checked={mandatory || isSelected} onChange={() => {toggleFunction(name)}}/>
            <label htmlFor={name}>{displayName}</label>
            <span style={{paddingLeft: '10px', color: 'gray'}}>{version}</span>
        </div>
    )
}
