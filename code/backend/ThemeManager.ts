import {ipcMain, nativeTheme} from 'electron'
import {channels} from './API'
import PreferencesManager from './Preferences/PreferencesManager'


export default class ThemeManager {
    constructor() {
        ipcMain.on(channels.toMain.setDarkMode, (_, val) => nativeTheme.themeSource = val.toLowerCase())
        ThemeManager.loadTheme()
    }

    private static loadTheme() {
        const theme = PreferencesManager.getInstance().get<any>('darkMode')
        nativeTheme.themeSource = theme.toLowerCase()
    }
}
