import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect } from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export function TriggerConfigEditor({
    isOpen,
    close,
    sceneObject,
    setSceneObject,
    triggerType,
    setTriggerType,
    triggerValue,
    setTriggerValue,
}) {
    const [sceneObjects, setSceneObjects] = React.useState<any[]>([])
    const [triggers, setTriggers] = React.useState<any[]>([])

    const handleSceneObjectChange = event => setSceneObject(event.target.value)

    const handleTriggerTypeChange = event => setTriggerType(event.target.value)

    const handleTriggerValueChange = event => setTriggerValue(event.target.value)

    useEffect(() => {
        const loadSceneObjects = async () => {
            const objects = await api.invoke(api.channels.toMain.getSceneObjects)
            setSceneObjects(objects)
        }

        const loadTriggers = async () => {
            const enabledPackages = await api.invoke(api.channels.toMain.getBuildSetting, 'selectedPackages')
            const packages = await api.invoke(api.channels.toMain.queryPackages)
            const triggers = packages.filter(p => enabledPackages.includes(p.name))
                                     .filter(p => p.triggers !== undefined)
                                     .map(p => p.triggers)
                                     .flat()
            setTriggers(triggers)
            await api.invoke(api.channels.toMain.setBuildSetting, 'triggers', triggers)
        }

        loadSceneObjects()
        loadTriggers()

        return () => {
            api.removeListeners(api.channels.toMain.getSceneObjects)
            api.removeListeners(api.channels.toMain.getBuildSetting)
            api.removeListeners(api.channels.toMain.queryPackages)
            api.removeListeners(api.channels.toMain.setBuildSetting)
        }
    }, [])

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button onClick={close} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </Button>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Trigger Configuration
                    </Typography>
                    <form>
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel id="sceneObject-label">Scene Object</InputLabel>
                            <Select id="sceneObject" value={sceneObject} onChange={handleSceneObjectChange} required>
                                {sceneObjects.map((object, index) => (
                                    <MenuItem key={index} value={object.uuid}>
                                        {object.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel id="triggerType-label">Trigger</InputLabel>
                            <Select id="subcategory" value={triggerType} onChange={handleTriggerTypeChange} required>
                                {triggers.map((trigger, index) => (
                                    <MenuItem key={index} value={trigger.name}>
                                        {trigger.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel id="value-label">Value</InputLabel>
                            <Select id="value" value={triggerValue} onChange={handleTriggerValueChange} required>
                                {triggers.find(t => t.name === triggerType)?.values.map((value, index) => (
                                    <MenuItem key={index} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}
