import { app, ipcMain as ipc, Menu, shell } from 'electron'

export default class CustomMenu {
    private projectLoaded = false

    private articyNotOpen = true;

    public loadCustomMenu() {
        const menu = Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Save Current Scene',
                        click: () => ipc.emit('save-current-scene'),
                        id: 'SaveScene',
                        enabled: this.projectLoaded && this.articyNotOpen,
                    },
                    {
                        label: 'Save Project',
                        click: () => ipc.emit('project-manager:save-project'),
                        id: 'SaveProject',
                        enabled: this.projectLoaded && this.articyNotOpen,
                    },
                    {
                        label: 'Project Settings',
                        click: () => ipc.emit('projectSettings:open'),
                        enabled: this.projectLoaded,
                        enabled: this.articyNotOpen
                    },
                    {
                        label: 'Preferences',
                        click: () => ipc.emit('preferences:open'),
                        enabled: this.articyNotOpen
                    },
                    {
                        label: 'Exit',
                        click: () => app.quit(),
                        enabled: this.articyNotOpen
                    },
                ],
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'About',
                        click() {
                            shell.openExternal('https://www.hci.uni-wuerzburg.de/projects/via-vr/')
                        },
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal(
                                'https://lectures.hci.informatik.uni-wuerzburg.de/viavr-docs/editor/index.html'
                            )
                        },
                    },
                ],
            },
            {
                label: 'Dev Tools',
                submenu: [
                    {
                        label: 'Open present working directory',
                        click: () => ipc.emit('dev:open-pwd'),
                        id: 'OpenDirectory',
                        enabled: this.projectLoaded,
                    },
                    {
                        role: 'toggleDevTools',
                    },
                    {
                        role: 'reload'
                    }
                ],
            },
        ])
        Menu.setApplicationMenu(menu)
    }

    public unlockMenuOptionsUponProjectOpened() {
        this.projectLoaded = true
        this.loadCustomMenu()
    }

    public lockMenuOptionsUponArticyOpened(){
        this.articyNotOpen = false
        this.loadCustomMenu()
    }

    public unlockMenuOptionsUponArticyClosed(){
        this.articyNotOpen = true
        this.loadCustomMenu()
    }
}
