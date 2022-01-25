import {IpcMainEvent} from 'electron'
import {IpcChannel, IpcRequest} from '../IpcChannel'

export default class PreferencesChannel extends IpcChannel {
    getName(): string {
        return 'preferences-info';
    }

    handle(event: IpcMainEvent, request: IpcRequest) {
        if(!request.responseChannel) {
            request.responseChannel = `${this.getName}-response`
        }
        event.sender.send(request.responseChannel, 'test')
    }
}
