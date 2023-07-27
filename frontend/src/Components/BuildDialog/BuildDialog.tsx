import { useEffect, useState } from 'react'
import { Package } from './Package'
import { Center, SettingsContainer, StyledSettings } from '../StyledComponents/Preferences/StyledSettings'
import { Button } from '../StyledComponents/Button'
import {
    ButtonContainer,
    ModalBackdrop,
    ModalContent,
    ModalTitle
} from '../StyledComponents/ModalWindow'
import { SettingAccordion } from '../Settings/SettingAccordion'
import { UnityPackageConfigurations } from './UnityPackageConfigurations'
import { Spinner, toaster } from 'evergreen-ui'
import { SupervisorMonitorSettings } from './SupervisorMonitorSettings'
import { InfoSpinnerBox } from './InfoSpinnerBox'
import { SpokeAPI } from '../../SpokeEditor/SpokeAPI'


type Scene = {
    isSelected: boolean
    sceneFileName: string
}

export const BuildDialog = ({hidden}) => {
    const [scenes, setScenes] = useState<Scene[]>([])
    const [packages, setPackages] = useState<any[]>([])
    const [isBuilding, setIsBuilding] = useState(false)
    const [isFetchingPackages, setIsFetchingPackages] = useState(false)
    const [showModal, setShowModal] = useState(false)


    function ModalWindow({ closeModal }) {
        return (
            <ModalBackdrop>
                <ModalContent>
                    <ModalTitle>The project should be saved before generating an experience.</ModalTitle>
                    <ModalTitle>Save the project now?</ModalTitle>
                    <ButtonContainer>
                        <Button onClick={async () =>{
                            closeModal()
                            saveProjectAndSceneThenBuild()}}>Save Project and Continue</Button>
                        <Button onClick={() => {
                            closeModal()
                            build()}}>Continue without Saving</Button>
                        <Button onClick={() => closeModal()}>Cancel</Button>
                    </ButtonContainer>
                </ModalContent>
            </ModalBackdrop>
            );
        }

    const togglePackageSelected = (packageName: string) => {
        const updatedPackages = packages.map(packageItem => {
            if (packageItem.name === packageName) {
                return {
                    ...packageItem,
                    isSelected: !packageItem.isSelected,
                }
            }
            return packageItem
        })
        setPackages(updatedPackages)
        api.invoke(
            api.channels.toMain.setBuildSetting,
            'selectedPackages',
            updatedPackages.filter(packageItem => packageItem.isSelected).map(packageItem => packageItem.name)
        )
    }

    const getSelectedSceneNames = () => {
        return scenes.filter(item => item.isSelected).map(scene => scene.sceneFileName)
    }

    const getSelectedPackages = () => {
        return packages.filter(item => item.mandatory || item.isSelected)
    }

    const loadScenes = async () => {
        const sceneFileNames: string[] = await api.invoke(api.channels.toMain.queryScenes)
        const selectedScenes: string[] = await api.invoke(api.channels.toMain.getBuildSetting, 'selectedScenes')
        setScenes(
            sceneFileNames.map(sceneFileName => {
                const settingExists = selectedScenes !== undefined
                const isSelected = true
                return { isSelected: isSelected, sceneFileName }
            })
        )
    }

    const saveProjectAndSceneThenBuild = async () => {
        await api.invoke(api.channels.toMain.saveProject)
        await SpokeAPI.Instance.postMessage(SpokeAPI.Messages.toSpoke.saveScene)
        await build()
    }

    const loadPackages = async () => {
        setIsFetchingPackages(true)
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        const selectedPackages = await api.invoke(api.channels.toMain.getBuildSetting, 'selectedPackages')
        const newPackages = packages.map(p => {
            const settingExists = selectedPackages !== undefined
            const isSelected = settingExists ? selectedPackages.includes(p.name) : p.mandatory
            return { ...p, isSelected }
        })
        setPackages(newPackages)
        await api.invoke(
            api.channels.toMain.setBuildSetting,
            'selectedPackages',
            newPackages.filter(p => p.isSelected).map(packageItem => packageItem.name)
        )
        setIsFetchingPackages(false)
    }

    const getPackagesToDraw = () => {
        return getSelectedPackages().filter(p => 'configDescription' in p)
    }

    const build = async () => {
        const outputPath = await api.invoke(
            api.channels.toMain.createUnityProject,
            getSelectedSceneNames(),
            getSelectedPackages()
        )
        if (outputPath === undefined) return
        toaster.notify('Started generating the experience, please wait.', { duration: 5 })
        setIsBuilding(true)
        await api.invoke(api.channels.toMain.buildUnityProject)
        const result: 'success' | 'failure' = await api.invoke(api.channels.toMain.checkBuildSuccess)
        setIsBuilding(false)
        if (result === 'failure') {
            toaster.danger('Something went wrong generating your VIA experience.', { duration: 30 })
            return
        }
        await api.invoke(api.channels.toMain.openBuildDirectory)
        toaster.success('The experience is now ready.', { duration: 5 })
    }

    useEffect(() => {
        if(hidden) return
        loadScenes()
        loadPackages()
    }, [hidden])

    return (
        <Center style={{backgroundColor: '#15171b'}} hidden={hidden}>
            <StyledSettings hidden={hidden}>
                <Center><h1>Generate VIA Experience</h1></Center>
                <InfoSpinnerBox hidden={!isFetchingPackages} text='Fetching package info' />
                <SettingsContainer hidden={hidden} style={{width: 610}}>
                    <SettingAccordion
                        summary={'Packages'}
                        details={
                            <>
                                {packages.map(p => (
                                    <Package
                                        key={p.name}
                                        name={p.name}
                                        displayName={p.displayName}
                                        version={p.version}
                                        description={p.description}
                                        isSelected={p.isSelected}
                                        mandatory={p.mandatory}
                                        toggleFunction={togglePackageSelected}
                                    />
                                ))}
                            </>
                        }
                    />
                    <SettingAccordion summary={'Supervisor Monitor'} details={<SupervisorMonitorSettings hidden={hidden} />} />
                    {getPackagesToDraw().length > 0 && <UnityPackageConfigurations packages={getPackagesToDraw()} />}
                    <br />
                    <div hidden={isBuilding}>
                        <Center>
                            <Button id="btn-build-project" type="button" onClick={() => setShowModal(true)}>
                                Generate Experience
                            </Button>
                        </Center>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div hidden={!isBuilding}>Generating experience. This will take a while, please wait...</div>
                        <Spinner hidden={!isBuilding} style={{ marginLeft: 10 }} />
                    </div>
                </SettingsContainer>
            </StyledSettings>

            {showModal && <ModalWindow closeModal={() => setShowModal(false)} />}
        </Center>
    )
}


