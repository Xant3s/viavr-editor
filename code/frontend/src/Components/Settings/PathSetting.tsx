import {StringSetting} from './StringSetting'
import {Button} from '../StyledComponents/Button'

export const PathSetting = ({id, uuid, label, value, onChange}) => {
    const selectPath = async () => {
        const path = await api.invoke(api.channels.toMain.showOpenFileDialog) as string
        if(path === undefined) return
        onChange(path)
    }

    return (
        <>
            <StringSetting id={id} uuid={uuid} label={label} value={value} onChange={onChange}/>
            <Button id={`btn-select-${id}`} onClick={selectPath} style={{marginLeft: 10}}>Select</Button>
        </>
    )
}
