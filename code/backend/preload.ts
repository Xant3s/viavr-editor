import * as Path from 'path'
const {contextBridge, ipcRenderer} = require("electron")

const validChannels = {
    "toMain": [
        "BuildSystem:select-unity-path",
        "BuildSystem:query-available-scenes",
        "BuildSystem:query-available-packages",
        "BuildSystem:create-unity-project",
        "BuildSystem:build-unity-project",
        "BuildSystem:open-build-directory",
        "BuildSystem:query-available-json-scenes",
        "dark-mode:set",
        "preferences:request",
        "preferences:changed",
        "project-manager:create-new-project",
        "project-manager:open-project",
        "project-manager:open-project-folder",
        "project-manager:get-present-working-directory"
    ],
    "fromMain": [
        "BuildSystem:build-finished",
        "BuildSystem:ready-to-build-project",
        "preferences:preference-changed-from-backend-unityPath",
        "project-manager:project-created",
        "project-manager:project-opened",
        "spoke:export-scene"
    ]
}

const send = (channel: string, ...args: any) => {
    if(validChannels["toMain"].includes(channel)) {
        ipcRenderer.send(channel, ...args)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
}

const invoke = async (channel: string, ...args: any) => {
    if(validChannels["toMain"].includes(channel)) {
        return ipcRenderer.invoke(channel, ...args)
    } else {
        console.error(`Invalid channel: ${channel}`)
    }
    return new Promise((_, reject) => { reject("Invalid channel") })
}

//@ts-ignore
const on = (channel: string, func) => {
    if(validChannels["fromMain"].includes(channel)) {
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
    Path: Path
}

contextBridge.exposeInMainWorld("api", API)
