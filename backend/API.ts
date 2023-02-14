import { ipcRenderer } from 'electron'
import Path from 'path'

export const channels = {
    'toMain': {
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
        changePackageSetting: 'unityPackageSettings:changed',
        setPackageSetting: 'unityPackageSettings:set',
        getPackageSetting: 'unityPackageSettings:get',
        createNewProject: 'project-manager:create-new-project',
        openArticyEditor: 'articy:open-editor',
        openProject: 'project-manager:open-project',
        openProjectFolder: 'project-manager:open-project-folder',
        getPresentWorkingDirectory: 'project-manager:get-present-working-directory',
        showOpenFileDialog: 'util:show-open-file-dialog',
    },
    'fromMain': {
        buildFinished: 'BuildSystem:build-finished',
        preferenceChangedFromBackendUnityPath: 'preferences:preference-changed-from-backend-unityPath',
        projectCreated: 'project-manager:project-created',
        projectOpened: 'project-manager:project-opened',
        spokeExportScene: 'spoke:export-scene',
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

const send = (channel: string, ...args: any) => {
    const validChannels = new ValidChannels()
    if(validChannels.toMain.includes(channel)) {
        ipcRenderer.send(channel, ...args)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}

const invoke = async (channel: string, ...args: any) => {
    const validChannels = new ValidChannels()
    if(validChannels.toMain.includes(channel)) {
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
    if(validChannels.fromMain.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}

export const API = {
    send: send,
    invoke: invoke,
    on: on,
    Path: Path,
    channels: channels,
}
