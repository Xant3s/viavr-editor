import { Checkbox } from '../Utils/UI'

type ToggleFunction = (sceneFileName: string) => void

interface IScene {
    isSelected: boolean,
    sceneFileName: string,
    toggleFunction: ToggleFunction
}

export const Scene = ({ isSelected, sceneFileName, toggleFunction }: IScene) => {
    return Checkbox({
        id: sceneFileName,
        checked: isSelected,
        onChange: () => toggleFunction(sceneFileName),
        label: sceneFileName.substring(0, sceneFileName.length - 4),
    })
}
