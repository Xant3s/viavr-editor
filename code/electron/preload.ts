const {contextBridge, ipcRenderer} = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["toMain"]
            if(validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel: string, func: (arg0: any) => void) => {
            let validChannels = ["fromMain"]
            if(validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                // @ts-ignore
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)
