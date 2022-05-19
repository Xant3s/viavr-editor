import {FC, useEffect, useState} from 'react'
import './Preferences.css'

export const Preferences: FC = () => {
    const [unityPath, setUnityPath] = useState([])
    const [registryName, setRegistryName] = useState([])
    const [registryUrl, setRegistryUrl] = useState([])
    const [registryScope, setRegistryScope] = useState([])
    const [themeSource, setThemeSource] = useState([])


    const loadPreference = (name: string) => {
        return window.api.invoke('preferences:request', name)
    }

    function handleInputChange(e) {
        setRegistryName(e.target.value)
    }

    useEffect(() => {
        const loadInitialValues = async() => {
            const [unityPath, registryName, registryUrl, registryScope, themeSource] = await Promise.all([
                loadPreference('unityPath'),
                loadPreference('packageRegistryName'),
                loadPreference('packageRegistryUrl'),
                loadPreference('packageRegistryScope'),
                loadPreference('darkMode')
            ])
            console.log(unityPath)
            console.log(registryName)
            setUnityPath(unityPath)
            setRegistryName(registryName)
            setRegistryUrl(registryUrl)
            setRegistryScope(registryScope)
            setThemeSource(themeSource)
        }

        loadInitialValues()
    })


    return (
        <>
            <h1>Preferences</h1>
            <br />

            <div className={'preference-entry'}>
                <label htmlFor={'dark-mode'}>Theme:</label>
                <select id={'dark-mode'} name={'dark-mode'} onChange={() => {}} >
                    <option value={'System'}>System</option>
                    <option value={'Dark'}>Dark</option>
                    <option value={'Light'}>Light</option>
                </select>
            </div>

            <div className={'preference-entry'}>
                <label htmlFor={'unity-path'}>Path to Unity executable:</label>
                <input id={'unity-path'} type={'text'} value={unityPath} />
                <button id={'btn-select-unity-path'}>Select</button>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-name">Package registry name:</label>
                <input id="package-registry-name" type="text" value={registryName} onChange={handleInputChange} /><br/>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-url">Package registry url:</label>
                <input id="package-registry-url" type="text" value={registryUrl} /><br/>
            </div>

            <div className="preference-entry">
                <label htmlFor="package-registry-scope">Package registry scope:</label>
                <input id="package-registry-scope" type="text" value={registryScope} /><br/>
            </div>
        </>
    )
}
