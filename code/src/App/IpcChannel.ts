import {ipcMain, IpcMainEvent} from 'electron'


export interface IpcRequest {
    responseChannel?: string
    params?: string[]
}

export abstract class IpcChannel {
    constructor() {
        ipcMain.on(this.getName(), (event, request) => this.handle(event, request))
    }

    abstract getName(): string

    abstract handle(event: IpcMainEvent, request: IpcRequest): void
}

