import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'
import {Package} from './Package'

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
        const sceneFileNames = await api.invoke('BuildSystem:query-available-scenes')
        setScenes(sceneFileNames.map(sceneFileName => {
            return ({isSelected: true, sceneFileName})
        }))
    }

    const loadPackages = async () => {
        const packages = await api.invoke('BuildSystem:query-available-packages')
        setPackages(packages)
    }

    useEffect(() => {
        loadScenes()
        loadPackages()
        api.on('BuildSystem:ready-to-build-project', () => {setReadyToBuild(true)})
        api.on('BuildSystem:build-finished', () => {setBuildFinished(true)})
    }, [])

    return (
        <>
            <title>Build Dialog</title>
            <h1>Build Settings</h1>
            <label>Select scenes to build:</label><br/>
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
            <button id="btn-create-project" type="button" onClick={() => api.send('BuildSystem:create-unity-project', getSelectedSceneNames(), getSelectedPackages())}>
                Create Unity Project
            </button>
            <br/>
            <br/>
            <label>Info: Build project will only work on Windows for now.</label>
            <br/>
            <button id="btn-build-project" type="button" onClick={() => api.send('BuildSystem:build-unity-project')} disabled={!readyToBuild}>
                Build Unity Project
            </button>
            <button id="btn-open-build-directory" type="button" onClick={() => api.send('BuildSystem:open-build-directory')} disabled={!buildFinished}>
                Open Build Directory
            </button>
        </>
    )
}
