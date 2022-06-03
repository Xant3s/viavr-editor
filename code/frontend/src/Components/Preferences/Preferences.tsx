import {FC, useEffect, useState} from 'react'
import './Preferences.css'
import {Preference} from './Preference'

export const Preferences: FC = () => {
    const [unityPath, setUnityPath] = useState('')
    const [registryName, setRegistryName] = useState('')
    const [registryUrl, setRegistryUrl] = useState('')
    const [registryScope, setRegistryScope] = useState('')
    const [themeSource, setThemeSource] = useState('')


    const loadPreference = (name: string) => {
        return api.invoke(api.channels.toMain.requestPreference, name)
    }

    const updatePreference = (updateStateFunction, event, name: string) => {
        updateStateFunction(event.target.value)
        api.send(api.channels.toMain.changePreference, {name: name, value: event.target.value})
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
            setUnityPath(unityPath)
            setRegistryName(registryName)
            setRegistryUrl(registryUrl)
            setRegistryScope(registryScope)
            setThemeSource(themeSource)
        }

        api.on(api.channels.fromMain.preferenceChangedFromBackendUnityPath, (data) => {setUnityPath(data)})

        loadInitialValues()
    })


    return (
        <>
            <h1>Preferences</h1>
            <br />

            <Preference id={'dark-mode'} label={'Theme'} value={themeSource} onChange={(e) => {
                updatePreference(setUnityPath, e, "darkMode")
                api.send(api.channels.toMain.setDarkMode, e.target.value)
            }} kind={'dropdown'} options={['System', 'Dark', 'Light']} />

            <Preference id={'unity-path'} label='Path to Unity executable' value={unityPath} onChange={(e) => {
                updatePreference(setUnityPath, e, "unityPath")
            }} kind={'path'} selectPath={() => {api.send(api.channels.toMain.selectUnityPath)}}  />

            <Preference id={'package-registry-name'} label={'Package registry name'} value={registryName} onChange={(e) => {
                updatePreference(setRegistryName, e, "packageRegistryName")
            }} />

            <Preference id={'package-registry-url'} label={'Package registry url'} value={registryUrl} onChange={(e) => {
                updatePreference(setRegistryUrl, e, "packageRegistryUrl")
            }} />

            <Preference id={'package-registry-scope'} label={'Package registry scope'} value={registryScope} onChange={(e) => {
                updatePreference(setRegistryScope, e, "packageRegistryScope")
            }} />
        </>
    )
}
