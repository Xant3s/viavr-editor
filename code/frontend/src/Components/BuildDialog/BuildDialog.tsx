import {FC, useEffect, useState} from 'react'
import {Scene} from './Scene'

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

    useEffect(() => {
        const loadScenes = async () => {
            const sceneFileNames = await window.api.invoke('query-available-scenes')
            setScenes(sceneFileNames.map(sceneFileName => {
                return ({isSelected: true, sceneFileName})
            }))
        }

        // loadScenes()
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
            <br/>
            <div id="package-list"></div>
            <br/>
            <button id="btn-create-project" type="button">Create Unity Project</button>
            <br/>
            <br/>
            <label>Info: Build project will only work on Windows for now.</label>
            <br/>
            <button id="btn-build-project" type="button" disabled>Build Unity Project</button>
            <button id="btn-open-build-directory" type="button" disabled>Open Build Directory</button>
        </>
    )
}
