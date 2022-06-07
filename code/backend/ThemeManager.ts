import {ipcMain, nativeTheme} from 'electron'
import {channels} from './API'
import PreferencesManager from './Preferences/PreferencesManager'
import {DropdownPreference} from './Preferences/Preferences'


export default class ThemeManager {
    constructor() {
        ipcMain.on(channels.toMain.setDarkMode, (_, val) => nativeTheme.themeSource = val.toLowerCase())
        ThemeManager.loadTheme()
    }

    private static loadTheme() {
        const theme = PreferencesManager.getInstance().get<DropdownPreference>('darkMode')
        nativeTheme.themeSource = theme.value.toLowerCase() as 'system' | 'dark' | 'light'
    }
}
