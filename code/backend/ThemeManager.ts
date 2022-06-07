import {nativeTheme} from 'electron'
import PreferencesManager from './Preferences/PreferencesManager'
import {DropdownPreference} from './Preferences/Preferences'


export default class ThemeManager {
    constructor() {
        PreferencesManager.getInstance().registerPreferenceUpdateEvent('darkMode', ThemeManager.setTheme)
        ThemeManager.loadTheme()
    }

    private static loadTheme() {
        const theme = PreferencesManager.getInstance().get<DropdownPreference>('darkMode')
        this.setTheme(theme)
    }

    private static setTheme(theme: DropdownPreference) {
        nativeTheme.themeSource = theme.value.toLowerCase() as 'system' | 'dark' | 'light'
    }
}
