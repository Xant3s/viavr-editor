import {Menu, ipcMain as ipc, app} from 'electron'


export default class CustomMenu {
    public loadCustomMenu() {
        const menu = Menu.buildFromTemplate([
            {
                label: "File",
                submenu: [
                    {
                      label: "Create New Project",
                      click: () => ipc.emit('project-manager:create-new-project')
                    },
                    {
                        label: "Open Project",
                        click: () => ipc.emit('project-manager:open-project')
                    },
                    {
                      label: "Preferences",
                        click: () => ipc.emit('open-preferences')
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
                        click: () => ipc.emit('open-build-menu')
                    }
                ]
            }
        ])
        Menu.setApplicationMenu(menu)
    }
}
