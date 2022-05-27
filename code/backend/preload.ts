import * as Path from 'path'
import {channels} from './API'
const {contextBridge, ipcRenderer} = require("electron")


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
