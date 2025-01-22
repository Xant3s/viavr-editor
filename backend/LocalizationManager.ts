import { app, ipcMain } from 'electron'
import PreferencesManager from './Preferences/PreferencesManager'
import { StringSetting } from '../frontend/src/@types/Settings'
import { API } from './API'

export class LocalizationManager {
    private availableLanguages = ['en', 'de']

    
    constructor() {
        ipcMain.handle(API.channels.toMain.detectSystemLanguage, this.detectLanguage.bind(this))
    }
    

    // If language is unknown detect system language and set it in the preferences.     
    public async ensureLanguageIsInPreferences() {
        const languagePref = await PreferencesManager.getInstance().get<StringSetting>('language')
        const language = languagePref.value
        const languageIsUnknown = language !== 'en' && language !== 'de' && language !== 'system'
        if (languageIsUnknown || language === 'system') {
            const detectedLanguage = this.detectLanguage()
            if(languageIsUnknown) {
                const newLanguagePref = {...languagePref, value: detectedLanguage}
                await PreferencesManager.getInstance().set<StringSetting>('language', newLanguagePref)
            }
        }
    }

    private detectLanguage(): string {
        const systemLang = (app.getLocale() || 'en').split('-')[0] // Detect system language
        return this.availableLanguages.includes(systemLang) ? systemLang : 'en' // Default to English
    }
}