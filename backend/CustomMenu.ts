import { app, ipcMain as ipc, Menu, shell } from 'electron'

export default class CustomMenu {
    public loadCustomMenu() {
        const menu = Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Save Current Scene',
                        click: () => ipc.emit('save-current-scene'),
                        id: 'SaveScene',
                        enabled: false,
                    },
                    {
                        label: 'Save Project',
                        click: () => ipc.emit('project-manager:save-project'),
                        id: 'SaveProject',
                        enabled: false,
                    },
                    {
                        label: 'Project Settings',
                        click: () => ipc.emit('projectSettings:open'),
                    },
                    {
                        label: 'Preferences',
                        click: () => ipc.emit('preferences:open'),
                    },
                    {
                        label: 'Exit',
                        click: () => app.quit(),
                    },
                ],
            },
            {
                label: 'Generate VIA Experience',
                submenu: [
                    {
                        label: 'Generate VIA Experience',
                        click: () => ipc.emit('BuildSystem:open-build-menu'),
                        id: 'GenerateExperience',
                        enabled: false,
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
                        enabled: false,
                    },
                    {
                        role: 'toggleDevTools',
                    },
                ],
            },
        ])
        Menu.setApplicationMenu(menu)
    }

    public unlockMenuOptionsUponProjectOpened(){
        const saveProject = Menu.getApplicationMenu()?.getMenuItemById("SaveProject")
        const saveScene = Menu.getApplicationMenu()?.getMenuItemById("SaveScene")
        const generateExperience =  Menu.getApplicationMenu()?.getMenuItemById("GenerateExperience")
        const openDirectory = Menu.getApplicationMenu()?.getMenuItemById("OpenDirectory")

        if(saveProject) saveProject.enabled = true
        if(saveScene) saveScene.enabled = true
        if(generateExperience) generateExperience.enabled = true
        if(openDirectory) openDirectory.enabled = true
    }
}
