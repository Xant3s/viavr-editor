type ToggleFunction = (sceneFileName: string) => void

interface IScene {
    isSelected: boolean,
    sceneFileName: string,
    toggleFunction: ToggleFunction
}

export const Scene = ({isSelected, sceneFileName, toggleFunction}: IScene) => {
    return (
        <div>
            <input id={sceneFileName} type={'checkbox'} checked={isSelected} onChange={() => {toggleFunction(sceneFileName)}}/>
            <label htmlFor={sceneFileName} >{sceneFileName.substring(0, sceneFileName.length - 4)}</label>
        </div>
    )
}
