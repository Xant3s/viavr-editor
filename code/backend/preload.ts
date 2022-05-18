const {contextBridge, ipcRenderer} = require("electron")


const send = (channel: string, data: any) => {
    let validChannels = ["toMain"]
    if(validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
    }
}

const invoke = async (channel: string, data: any) => {
    let validChannels = ["toMain"]
    if(validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data)
    }
    return new Promise((_, reject) => { reject("Invalid channel") })
}

//@ts-ignore
const on = (channel: string, func) => {
    let validChannels = ["fromMain"]
    if(validChannels.includes(channel)) {
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
