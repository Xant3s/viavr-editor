import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { translationsData } from './TranslationsData'

interface TranslationContextType {
    translate: (key: string) => string;
    language: string;
    setLanguage: (newLanguage: 'en' | 'de') => Promise<void>;
}

const TranslationContext = createContext<TranslationContextType>({
    translate: (key: string) => key,
    language: 'en',
    setLanguage: async () => {
    },
})

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('en')
    const [translations, setTranslations] = useState(translationsData['en']) // Default to English

    const updateLanguage = useCallback(async (newLanguage: 'en' | 'de') => {
        const languagePrefUuid = '941802b4-b837-4eea-b709-d1b002b47e15'
        await api.invoke(api.channels.toMain.changePreference, languagePrefUuid, newLanguage)

        // Load the correct translation data when language changes
        setTranslations(translationsData[newLanguage] || translationsData['en'])
        setLanguage(newLanguage)
    }, [])

    useEffect(() => {
        (async () => {
            const languagePref = await api.invoke(api.channels.toMain.requestPreference, 'language')
            let lang: string = languagePref.value
            if(lang === 'system') {
                lang = await api.invoke(api.channels.toMain.detectSystemLanguage)
            }
            await updateLanguage(lang as 'en' | 'de')
        })()
    }, [updateLanguage])

    const translate = (key: string) => translations[key] || key

    return (
        <TranslationContext.Provider value={{ translate, language, setLanguage: updateLanguage }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => useContext(TranslationContext)
