import {IpcMainEvent, ipcMain} from 'electron'
import {IpcChannelInterface, IpcRequest} from '../IpcChannelInterface'

export default class PreferencesChannel implements IpcChannelInterface {
    init(){
        ipcMain.on(this.getName(), (event, request) => this.handle(event, request))
    }

    getName(): string {
        return 'preferences-info'
    }

    handle(event: IpcMainEvent, request: IpcRequest) {
        if(!request.responseChannel) {
            request.responseChannel = `${this.getName()}-response`
        }
        event.sender.send(request.responseChannel, 'test')
    }
}
