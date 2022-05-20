import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'
import {Package} from './Package'

export const BuildDialog: FC = () => {
    const [scenes, setScenes] = useState([
        {
            isSelected: true,
            sceneFileName: 'Scene 1.glb',
        },
        {
            isSelected: false,
            sceneFileName: 'Scene 2.glb',
        },
        {
            isSelected: true,
            sceneFileName: 'Scene 3.glb',
        }
    ])

    const [packages, setPackages] = useState<any[]>([])

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

    const getSelectedScenes = () => {
        return scenes.filter(item => item.isSelected)
    }

    const getSelectedPackages = () => {
        return packages.filter(item => item.mandatory || item.isSelected)
    }

    useEffect(() => {
        const loadScenes = async () => {
            const sceneFileNames = await window.api.invoke('query-available-scenes')
            setScenes(sceneFileNames.map(sceneFileName => {
                return ({isSelected: true, sceneFileName})
            }))
        }

        const loadPackages = async () => {
            const packages = await window.api.invoke('query-available-packages')
            console.log(packages)
            setPackages(packages)
        }

        // loadScenes()
        loadPackages()
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
            <button id="btn-query-packages" type="button">Search for Packages</button>
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
            <button id="btn-create-project" type="button" onClick={() => window.api.send('create-unity-project', getSelectedScenes(), getSelectedPackages())}>
                Create Unity Project
            </button>
            <br/>
            <br/>
            <label>Info: Build project will only work on Windows for now.</label>
            <br/>
            <button id="btn-build-project" type="button" onClick={() => window.api.send('create-unity-project')} disabled>
                Build Unity Project
            </button>
            <button id="btn-open-build-directory" type="button" onClick={() => window.api.send('open-build-directory')} disabled>
                Open Build Directory
            </button>
        </>
    )
}
