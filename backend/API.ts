import { ipcRenderer } from 'electron'
import Path from 'path'

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
        getSceneFileContents: 'project-manager:get-scene-file-contents'
    },
    fromMain: {
        preferenceChangedFromBackendUnityPath: 'preferences:preference-changed-from-backend-unityPath',
        projectCreated: 'project-manager:project-created',
        projectOpened: 'project-manager:project-opened',
        spokeExportScene: 'spoke:export-scene',
        spokeProjectSavedSuccessfully: 'spoke:project-saved-successfully',
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

//@ts-ignore
const on = (channel: string, func) => {
    const validChannels = new ValidChannels()
    if (validChannels.fromMain.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}

const removeListener = (channel: string, func) => {
    const validChannels = new ValidChannels()
    if (validChannels.fromMain.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.removeListener(channel, (event, ...args) => func(...args))
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}

const removeListeners =  (channel: string) => {
    const validChannels = new ValidChannels()
    if (validChannels.fromMain.includes(channel)) {
        return ipcRenderer.removeAllListeners(channel)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
    return new Promise((_, reject) => {
        reject('Invalid channel')
    })
}

export const API = {
    invoke: invoke,
    on: on,
    removeListener: removeListener,
    removeListeners: removeListeners,
    Path: Path,
    channels: channels,
}
