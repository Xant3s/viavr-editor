const {contextBridge, ipcRenderer} = require("electron")


const send = (channel: string, data: any) => {
    // whitelist channels
    let validChannels = ["toMain"]
    if(validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
    }
}

//@ts-ignore
const receive = (channel: string, func) => {
    let validChannels = ["fromMain"]
    if(validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
}

export const API = {
    send: send,
    receive: receive
}

contextBridge.exposeInMainWorld("api", API)
