import {ipcMain as ipc} from 'electron'

export default class HelloWorld {
    constructor() {
        ipc.on('test', () => HelloWorld.printHelloWorld())
    }

    private static printHelloWorld() {
        console.log('Hello World!')
    }
}

