const {contextBridge, ipcRenderer} = require("electron")

const validChannels = {
    "toMain": [
        "toMain",
        "preferences:request"
    ],
    "fromMain": [
        "fromMain"
    ]
}

const send = (channel: string, data: any) => {
    if(validChannels["toMain"].includes(channel)) {
        ipcRenderer.send(channel, data)
    }
}

const invoke = async (channel: string, data: any) => {
    if(validChannels["toMain"].includes(channel)) {
        return ipcRenderer.invoke(channel, data)
    }
    return new Promise((_, reject) => { reject("Invalid channel") })
}

//@ts-ignore
const on = (channel: string, func) => {
    if(validChannels["fromMain"].includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
}

export const API = {
    send: send,
    invoke: invoke,
    on: on
}

contextBridge.exposeInMainWorld("api", API)
