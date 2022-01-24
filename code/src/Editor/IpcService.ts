import {IpcRenderer} from 'electron'
import {IpcRequest} from '../App/IpcChannelInterface'

export class IpcService{
    private ipcRenderer?: IpcRenderer


    private initializeIpcRenderer(){
        if(!window || !window.process || !window.require){
            throw new Error(`Unable to require renderer process`)
        }
        this.ipcRenderer = window.require('electron').ipcRenderer
    }

    public send<T>(channel: string, request: IpcRequest ={}): Promise<T>{
        if(!this.ipcRenderer){
            this.initializeIpcRenderer()
        }

        // If there's no responseChannel, autogenerate it
        if(!request.responseChannel){
            request.responseChannel = `${channel}-response-${new Date().getTime()}`
        }

        const ipcRenderer = this.ipcRenderer
        // @ts-ignore
        ipcRenderer.send(channel, request)

        // This method returns a promise that resolves when the response is received
        return new Promise<T>(resolve =>
            ipcRenderer?.once(request.responseChannel as string, (event, response) => resolve(response)))
    }
}
