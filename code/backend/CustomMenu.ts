import {Menu, ipcMain as ipc, app, ipcRenderer} from 'electron'


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
                            require('electron').shell.openExternal('https://www.hci.uni-wuerzburg.de/projects/via-vr/')
                        }
                    },
                    {
                        label: 'Documentation',
                        click() {
                            require('electron').shell.openExternal('https://gitlab2.informatik.uni-wuerzburg.de/GE/Teaching/grl/2021-truman-viavr-editor/-/wikis/home')
                        }
                    }
                ]
            },
            {
                label: 'Build',
                submenu: [
                    {
                        label: "Open Build Menu",
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
                        label: "Print URL",
                        click: async () => {
                            ipc.emit('print-main-window-url')
                        }
                    }
                ]
            }
        ])
        Menu.setApplicationMenu(menu)
    }
}
