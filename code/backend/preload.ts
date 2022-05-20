const {contextBridge, ipcRenderer} = require("electron")

const validChannels = {
    "toMain": [
        "toMain",
        "preferences:request",
        "preferences-changed",
        "select-unity-path",
        "dark-mode:set",
        "query-available-scenes",
        "query-available-packages",
        "create-unity-project",
        "build-unity-project",
        "open-build-directory"
    ],
    "fromMain": [
        "fromMain",
        "preference-changed-from-backend-unityPath"
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
    on: on
}

contextBridge.exposeInMainWorld("api", API)
