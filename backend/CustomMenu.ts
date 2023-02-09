import {Menu, ipcMain as ipc, app, shell} from 'electron'


export default class CustomMenu {
    public loadCustomMenu() {
        const menu = Menu.buildFromTemplate([
            {
                label: "File",
                submenu: [
                    {
                        label: "Save Current Scene",
                        click: () => ipc.emit('save-current-scene')
                    },
                    {
                      label: "Save Project",
                      click: () => ipc.emit('project-manager:save-project')
                    },
                    {
                      label: "Project Settings",
                        click: () => ipc.emit('projectSettings:open')
                    },
                    {
                        label: "Preferences",
                        click: () => ipc.emit('preferences:open')
                    },
                    {
                        label: "Exit",
                        click: () => app.quit()
                    }
                ]
            },
            {
                role: 'editMenu',
            },
            {
                role: 'viewMenu',
            },
            {
                role: 'windowMenu',
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'About',
                        click() {
                            shell.openExternal('https://www.hci.uni-wuerzburg.de/projects/via-vr/')
                        }
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal('https://lectures.hci.informatik.uni-wuerzburg.de/viavr-docs/editor/index.html')
                        }
                    }
                ]
            },
            {
                label: 'Generate VIA Experience',
                submenu: [
                    {
                        label: "Generate VIA Experience",
                        click: () => ipc.emit('BuildSystem:open-build-menu')
                    }
                ]
            },
            {
                label: 'Dev Tools',
                submenu: [
                    {
                        label: "Open present working directory",
                        click: () => ipc.emit('dev:open-pwd')
                    },
                    {
                        label: "Open Panels Prototype",
                        click: async () => {
                            ipc.emit('dev:open-panels-prototype')
                        }
                    },
                    {
                        label: "Open Tabs Prototype",
                        click: async () => {
                            ipc.emit('dev:open-tabs-prototype')
                        }
                    }
                ]
            }
        ])
        Menu.setApplicationMenu(menu)
    }
}
