import {IpcMainEvent} from 'electron'
import {IpcChannel, IpcRequest} from '../IpcChannel'
import PreferencesManager from './PreferencesManager'

export default class PreferencesChannel extends IpcChannel {
    getName(): string {
        return 'preferences-request';
    }

    handle(event: IpcMainEvent, request: IpcRequest) {
        if(!request.responseChannel) {
            request.responseChannel = `preferences-response`
        }
        if(request.params) {
            event.sender.send(request.responseChannel, PreferencesManager.getInstance().get<string>(request.params[0]))
        }
    }
}
