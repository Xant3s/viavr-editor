import { ipcRenderer } from 'electron'
import Path from 'path'
import {v4 as uuid} from 'uuid'

export const channels = {
    toMain: {
        queryScenes: 'BuildSystem:query-available-scenes',
        queryPackages: 'BuildSystem:query-available-packages',
        createUnityProject: 'BuildSystem:create-unity-project',
        buildUnityProject: 'BuildSystem:build-unity-project',
        checkBuildSuccess: 'BuildSystem:check-build-success',
        openBuildDirectory: 'BuildSystem:open-build-directory',
        queryJsonScenes: 'BuildSystem:query-available-json-scenes',
        requestPreference: 'preferences:request',
        requestPreferences: 'preferences:request-all',
        changePreference: 'preferences:changed',
        requestProjectSetting: 'projectSettings:request',
        requestProjectSettings: 'projectSettings:request-all',
        changeProjectSetting: 'projectSettings:changed',
        unsafeSetProjectSetting: 'projectSettings:set-unsafe',
        changePackageSetting: 'unityPackageSettings:changed',
        setPackageSetting: 'unityPackageSettings:set',
        getPackageSetting: 'unityPackageSettings:get',
        setBuildSetting: 'buildSettings:set',
        getBuildSetting: 'buildSettings:get',
        createNewProject: 'project-manager:create-new-project',
        openArticyEditor: 'articy:open-editor',
        openProject: 'project-manager:open-project',
        openProjectFolder: 'project-manager:open-project-folder',
        openFloorMapEditor: 'BuildSystem:open-floor-map-editor',
        getPresentWorkingDirectory: 'project-manager:get-present-working-directory',
        showOpenFileDialog: 'util:show-open-file-dialog',
        floorMapNewPng: 'floor-map:new-png',
        floorMapNewSvg: 'floor-map:new-svg',
        floorMapGetSvg: 'floor-map:get-svg',
        floorMapLoadSvg: 'floor-map:load-svg',
        getSceneObjects: 'scene:get-objects',
        shareProject: 'share:project',
        downloadProjectTemplates: 'share:download-projects',
        runPreprocessor: 'preprocessor:run',
        getSceneFileContents: 'project-manager:get-scene-file-contents',
        saveProject: 'project-manager:save-project',
        saveScene: 'scene-exporter:save-current-scene',
        downloadAvatar: 'avatar:download',
    },
    fromMain: {
        preferenceChangedFromBackendUnityPath: 'preferences:preference-changed-from-backend-unityPath',
        projectCreated: 'project-manager:project-created',
        projectOpened: 'project-manager:project-opened',
        spokeExportScene: 'spoke:export-scene',
        spokeSceneSavedSuccessfully: 'spoke:scene-saved-successfully',
        spokeProjectSavedSuccessfully: 'spoke:project-saved-successfully',
        externalWindowOpened:'articy:open-editor-and-disable-window',
        externalWindowClosed:'articy:open-editor'
    },
}

class ValidChannels {
    toMain: string[]
    fromMain: string[]

    constructor() {
        this.toMain = Object.values(channels.toMain)
        this.fromMain = Object.values(channels.fromMain)
    }
}

/// From the renderer process to main. Resolves with the response from main. See ipcRenderer.invoke for more info.
const invoke = async (channel: string, ...args: any) => {
    const validChannels = new ValidChannels()
    if (validChannels.toMain.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
    return new Promise((_, reject) => {
        reject('Invalid channel')
    })
}

const listeners = new Map<string, any>()    // Map<uuid, function>

/// Used in the renderer process to receive messages from main. Returns an uuid that can be used to remove the listener.
/// See ipcRenderer.on for more info.
//@ts-ignore
const on = (channel: string, func) => {
    const validChannels = new ValidChannels()
    if (validChannels.fromMain.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        const listener = (event, ...args) => func(...args)
        const id = uuid()
        ipcRenderer.on(channel, listener)
        listeners.set(id, listener)
        return id
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
    return ''
}

/// Used in the renderer process to stop receiving messages from main.
/// Removes the specified listener from the listener array for the specified channel. See ipcRenderer.removeListener for more info.
const removeListener = (channel: string, funcId: string) => {
    const validChannels = new ValidChannels()
    if (validChannels.fromMain.includes(channel)) {
        ipcRenderer.removeListener(channel, listeners.get(funcId))
        listeners.delete(funcId)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}


export const API = {
    invoke: invoke,
    on: on,
    removeListener: removeListener,
    Path: Path,
    channels: channels,
}
