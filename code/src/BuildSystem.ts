import {ipcMain as ipc} from 'electron'

export default class BuildSystem {
    constructor() {
        ipc.on('open-build-menu', () => this.openBuildMenu())
    }

    private openBuildMenu(){
        console.log("Build System");
    }
}
