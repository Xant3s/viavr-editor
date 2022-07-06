import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'
import {Package} from './Package'
import {SettingsContainer, StyledSettings} from '../StyledComponents/Preferences/StyledSettings'
import {Button} from '../StyledComponents/Button'
import {SettingAccordion} from '../Settings/SettingAccordion'
import {UnityPackageConfigurations} from './UnityPackageConfigurations'
import {Spinner, toaster} from 'evergreen-ui'

export const BuildDialog: FC = () => {
    const [scenes, setScenes] = useState<any[]>([])
    const [packages, setPackages] = useState<any[]>([])
    const [isBuilding, setIsBuilding] = useState(false)


    const toggleSceneSelected = (sceneFileName: string) => {
        setScenes(scenes.map(scene => {
            if(scene.sceneFileName === sceneFileName) {
                return {
                    ...scene,
                    isSelected: !scene.isSelected
                }
            }
            return scene
        }))
    }

    const togglePackageSelected = (packageName: string) => {
        setPackages(packages.map(packageItem => {
            if(packageItem.name === packageName) {
                return {
                    ...packageItem,
                    isSelected: !packageItem.isSelected
                }
            }
            return packageItem
        }))
    }

    const getSelectedSceneNames = () => {
        return scenes.filter(item => item.isSelected)
                     .map(scene => scene.sceneFileName)
    }

    const getSelectedPackages = () => {
        return packages.filter(item => item.mandatory || item.isSelected)
    }

    const loadScenes = async() => {
        const sceneFileNames = await api.invoke(api.channels.toMain.queryScenes)
        setScenes(sceneFileNames.map(sceneFileName => {
            return ({isSelected: true, sceneFileName})
        }))
    }

    const loadPackages = async() => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        setPackages(packages)
    }

    const getPackagesToDraw = () => {
        return getSelectedPackages().filter(p => 'configDescription' in p)
    }

    const build = async() => {
        const outputPath = await api.invoke(api.channels.toMain.createUnityProject, getSelectedSceneNames(), getSelectedPackages())
        if(outputPath === undefined) return
        toaster.notify('Started generating the experience, please wait.', {duration: 5})
        setIsBuilding(true)
        await api.invoke(api.channels.toMain.buildUnityProject)
        await api.invoke(api.channels.toMain.openBuildDirectory)
        setIsBuilding(false)
        toaster.success('The experience is now ready.', {duration: 5})
    }

    useEffect(() => {
        loadScenes()
        loadPackages()
    }, [])

    return (
        <StyledSettings>
            <h1>Generate VIA Experience</h1>

            <SettingsContainer>

                <SettingAccordion summary={'Scenes'} details={(
                    <>
                        {
                            scenes.map(({isSelected, sceneFileName}) => (
                                <Scene key={sceneFileName} isSelected={isSelected} sceneFileName={sceneFileName}
                                       toggleFunction={toggleSceneSelected}/>
                            ))
                        }
                    </>
                )}/>

                <SettingAccordion summary={'Packages'} details={(
                    <>
                        {packages.map(p => (
                            <Package key={p.name}
                                     name={p.name}
                                     displayName={p.displayName}
                                     version={p.version}
                                     description={p.description}
                                     isSelected={p.isSelected}
                                     mandatory={p.mandatory}
                                     toggleFunction={togglePackageSelected}/>
                        ))}
                    </>
                )}/>

                {getPackagesToDraw().length > 0 && <UnityPackageConfigurations packages={getPackagesToDraw()} />}

                <br/>
                <div hidden={isBuilding}>
                    <Button id="btn-build-project" type="button" onClick={build}>Generate Experience</Button>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div hidden={!isBuilding}>Generating experience. This will take a while, please wait...</div>
                    <Spinner hidden={!isBuilding} style={{marginLeft: 10}} />
                </div>
            </SettingsContainer>
        </StyledSettings>
    )
}
