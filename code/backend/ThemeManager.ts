import {nativeTheme} from 'electron'
import PreferencesManager from './Preferences/PreferencesManager'
import {DropdownSetting} from '../frontend/src/@types/Settings'


export default class ThemeManager {
    constructor() {
        PreferencesManager.getInstance().registerPreferenceUpdateEvent('darkMode', ThemeManager.setTheme)
        ThemeManager.loadTheme()
    }

    private static loadTheme() {
        const theme = PreferencesManager.getInstance().get<DropdownSetting>('darkMode')
        this.setTheme(theme)
    }

    private static setTheme(theme: DropdownSetting) {
        nativeTheme.themeSource = theme.value.toLowerCase() as 'system' | 'dark' | 'light'
    }
}
