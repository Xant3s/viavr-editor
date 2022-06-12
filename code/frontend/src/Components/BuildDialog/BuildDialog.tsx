import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'
import {Package} from './Package'
import {PreferencesContainer, StyledPreferences } from '../StyledComponents/Preferences/StyledPreferences'
import { Button } from '../StyledComponents/Button'

export const BuildDialog: FC = () => {
    const [scenes, setScenes] = useState<any[]>([])
    const [packages, setPackages] = useState<any[]>([])
    const [readyToBuild, setReadyToBuild] = useState(false)
    const [buildFinished, setBuildFinished] = useState(false)

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
            if(packageItem.packageName === packageName) {
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

    const loadScenes = async () => {
        const sceneFileNames = await api.invoke(api.channels.toMain.queryScenes)
        setScenes(sceneFileNames.map(sceneFileName => {
            return ({isSelected: true, sceneFileName})
        }))
    }

    const loadPackages = async () => {
        const packages = await api.invoke(api.channels.toMain.queryPackages)
        setPackages(packages)
    }

    useEffect(() => {
        loadScenes()
        loadPackages()
        api.on(api.channels.fromMain.readyToBuildProject, () => {setReadyToBuild(true)})
        api.on(api.channels.fromMain.buildFinished, () => {setBuildFinished(true)})
    }, [])

    return (
        <StyledPreferences>
            <h1>Build Settings</h1>
            <PreferencesContainer>

            <h4>Scenes</h4>

                {
                scenes.map(({isSelected, sceneFileName}) => (
                    <Scene key={sceneFileName} isSelected={isSelected} sceneFileName={sceneFileName} toggleFunction={toggleSceneSelected}/>
                ))
            }

            <br/>
            <h4>Packages</h4>

            {packages.map((p) => (
                <Package key={p.name}
                         name={p.name}
                         displayName={p.displayName}
                         version={p.version}
                         description={p.description}
                         isSelected={p.isSelected}
                         mandatory={p.mandatory}
                         toggleFunction={togglePackageSelected}/>
            ))}

            <br/>
            <div id="package-list"></div>
            <br/>
            <Button id="btn-create-project" type="button" onClick={() => api.send(api.channels.toMain.createUnityProject, getSelectedSceneNames(), getSelectedPackages())}>
                Create Unity Project
            </Button>
            <br/>
            <Button id="btn-build-project" type="button" onClick={() => api.send(api.channels.toMain.buildUnityProject)} disabled={!readyToBuild}>
                Build Unity Project
            </Button>
            <Button id="btn-open-build-directory" type="button" onClick={() => api.send(api.channels.toMain.openBuildDirectory)} disabled={!buildFinished}>
                Open Build Directory
            </Button>
            </PreferencesContainer>
        </StyledPreferences>
    )
}
