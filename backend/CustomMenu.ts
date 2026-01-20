import { ipcMain as ipc, Menu, shell } from 'electron'
import { LocalizationManager } from './LocalizationManager'

export default class CustomMenu {
    private projectLoaded = false
    private articyNotOpen = true

    private translationData = {
        "en": {
            "menu_file": "File",
            "menu_save_project": "Save Project",
            "menu_project_settings": "Project Settings",
            "menu_preferences": "Preferences",
            "menu_back_to_main_menu": "Back to Main Menu",
            "menu_exit": "Exit",
            "menu_about": "About",
            "menu_user_manual": "User Manual",
            "menu_dev_tools": "Dev Tools",
            "menu_open_pwd": "Open present working directory",
            "menu_help": "Help",
        },
        "de": {
            "menu_file": "Datei",
            "menu_save_project": "Projekt speichern",
            "menu_project_settings": "Projekteinstellungen",
            "menu_preferences": "Einstellungen",
            "menu_back_to_main_menu": "Zurück zum Hauptmenü",
            "menu_exit": "Beenden",
            "menu_about": "Über",
            "menu_user_manual": "Benutzerhandbuch",
            "menu_dev_tools": "Entwicklertools",
            "menu_open_pwd": "Aktuelles Arbeitsverzeichnis öffnen",
            "menu_help": "Hilfe",
        }
    }

    public async loadCustomMenu() {
        const language = await LocalizationManager.getInstance().getDefinitiveLanguage()


        const menu = Menu.buildFromTemplate([
            {
                label: this.translationData[language]['menu_file'], // "File"
                submenu: [
                    {
                        label: this.translationData[language]['menu_save_project'], // "Save Project"
                        accelerator: 'CmdOrCtrl+S',
                        click: () => ipc.emit('project-manager:save-project'),
                        id: 'SaveProject',
                        enabled: this.projectLoaded && this.articyNotOpen,
                    },
                    {
                        label: this.translationData[language]['menu_project_settings'], // "Project Settings"
                        click: () => ipc.emit('projectSettings:open'),
                        enabled: this.projectLoaded && this.articyNotOpen
                    },
                    {
                        label: this.translationData[language]['menu_preferences'], // "Preferences"
                        click: () => ipc.emit('preferences:open'),
                        enabled: this.articyNotOpen
                    },
                    {
                        label: this.translationData[language]['menu_back_to_main_menu'], // "Back to Main Menu"
                        click: () => ipc.emit('project-manager:unload-project'),
                        id: 'UnloadProject',
                        enabled: this.projectLoaded && this.articyNotOpen
                    },
                    {
                        label: this.translationData[language]['menu_exit'], // "Exit"
                        click: () => ipc.emit('editor:try-exit'),
                        enabled: this.articyNotOpen
                    },
                ],
            },
            {
                label: this.translationData[language]['menu_help'], // "help"
                submenu: [
                    {
                        label: this.translationData[language]['menu_about'], // "About"
                        click() {
                            shell.openExternal('https://go.uniwue.de/via-vr')
                        },
                    },
                    {
                        label: this.translationData[language]['menu_user_manual'], // "User Manual"
                        click() {
                            shell.openPath('UserManual.pdf')
                        },
                    },
                ],
            },
            {
                label: this.translationData[language]['menu_dev_tools'], // "Dev Tools"
                submenu: [
                    {
                        label: this.translationData[language]['menu_open_pwd'], // "Open present working directory"
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

    public lockMenuOptionsUponArticyOpened() {
        this.articyNotOpen = false
        this.loadCustomMenu()
    }

    public unlockMenuOptionsUponArticyClosed() {
        this.articyNotOpen = true
        this.projectLoaded = true
        this.loadCustomMenu()
    }

    public lockMenuOptionsUponProjectClosed() {
        this.projectLoaded = false
        this.loadCustomMenu()
    }
}
