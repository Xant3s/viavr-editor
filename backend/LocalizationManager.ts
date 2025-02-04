import { app, BrowserWindow, ipcMain } from 'electron'
import PreferencesManager from './Preferences/PreferencesManager'
import { StringSetting } from '../frontend/src/@types/Settings'
import { API, channels } from './API'
import MainWindow from './MainWindow'

export class LocalizationManager {
    private static instance: LocalizationManager | null = null
    private availableLanguages = ['en', 'de']
    private mainWindow: MainWindow | null = null

    
    private constructor() {
        // Singleton
    }
    
    public static getInstance(): LocalizationManager {
        if(!this.instance) {
            this.instance = new LocalizationManager()
        }
        return this.instance
    }
    
    public setMainWindow(mainWindow: MainWindow) {
        this.mainWindow = mainWindow
        ipcMain.handle(API.channels.toMain.detectSystemLanguage, this.detectLanguage.bind(this))
        ipcMain.handle(API.channels.toMain.getDefinitiveLanguage, this.getDefinitiveLanguage.bind(this))
        ipcMain.handle(API.channels.toMain.sendNewLanguageToAllWindows, (_, lang) => this.broadcastNewLanguage(lang))
    }

// If language is unknown detect system language and set it in the preferences.     
    public async ensureLanguageIsInPreferences() {
        const languagePref = await PreferencesManager.getInstance().get<StringSetting>('dev.language')
        const language = languagePref.value
        const languageIsUnknown = language !== 'en' && language !== 'de' && language !== 'system'
        if (languageIsUnknown || language === 'system') {
            const detectedLanguage = this.detectLanguage()
            if(languageIsUnknown) {
                const newLanguagePref = {...languagePref, value: detectedLanguage}
                await PreferencesManager.getInstance().set<StringSetting>('dev.language', newLanguagePref)
            }
        }
    }
    
    async getDefinitiveLanguage() {
        const languagePref = await PreferencesManager.getInstance().get<StringSetting>('dev.language')
        const language = languagePref.value
        const languageIsUnknown = language !== 'en' && language !== 'de' && language !== 'system'
        if (languageIsUnknown || language === 'system') {
            return this.detectLanguage()
        }
        return language
    }

    private detectLanguage(): string {
        const systemLang = (app.getLocale() || 'en').split('-')[0] // Detect system language
        return this.availableLanguages.includes(systemLang) ? systemLang : 'en' // Default to English
    }
    
    private broadcastNewLanguage(newLanguage: string): void {
        BrowserWindow.getAllWindows().forEach(win => {
            this.mainWindow?.send(channels.fromMain.newLanguage, newLanguage)
            win.webContents.send(channels.fromMain.newLanguage, newLanguage)
        })
    }
}