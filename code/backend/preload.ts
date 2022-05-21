import * as Path from 'path'
const {contextBridge, ipcRenderer} = require("electron")


const channels = {
    "toMain": {
        buildSystemSelectUnityPath: 'BuildSystem:select-unity-path',
        buildSystemQueryAvailableScenes: "BuildSystem:query-available-scenes",
        buildSystemQueryAvailablePackages: "BuildSystem:query-available-packages",
        buildSystemCreateUnityProject: "BuildSystem:create-unity-project",
        buildSystemBuildUnityProject: "BuildSystem:build-unity-project",
        buildSystemOpenBuildDirectory: "BuildSystem:open-build-directory",
        buildSystemQueryAvailableJsonScenes: "BuildSystem:query-available-json-scenes",
        darkModeSet: "dark-mode:set",
        preferencesRequest: "preferences:request",
        preferencesChanged: "preferences:changed",
        projectManagerCreateNewProject: "project-manager:create-new-project",
        projectManagerOpenProject: "project-manager:open-project",
        projectManagerOpenProjectFolder: "project-manager:open-project-folder",
        projectManagerGetPresentWorkingDirectory: "project-manager:get-present-working-directory"
    },
    "fromMain": {
       buildSystemBuildFinished: "BuildSystem:build-finished",
        buildSystemReadyToBuildProject: "BuildSystem:ready-to-build-project",
        preferencesPreferenceChangedFromBackendUnityPath: "preferences:preference-changed-from-backend-unityPath",
        projectManagerProjectCreated: "project-manager:project-created",
        projectManagerProjectOpened: "project-manager:project-opened",
        spokeExportScene: "spoke:export-scene"
    }
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
    return new Promise((_, reject) => { reject("Invalid channel") })
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
    channels: channels
}

contextBridge.exposeInMainWorld("api", API)
