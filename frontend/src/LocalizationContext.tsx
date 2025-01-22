import React, { createContext, useContext, useEffect, useState } from 'react'
import { translationsData } from './TranslationsData'

const TranslationContext = createContext({
    translate: (key: string) => key,
    language: 'en',
    setLanguage: (lang: string) => {},
})

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('en')
    const [translations, setTranslations] = useState(translationsData["en"]); // Default to English
    
    
    useEffect(() => {
        (async () => {
            const languagePref = await api.invoke(api.channels.toMain.requestPreference, 'language')
            let language: string = languagePref.value
            if(language === 'system') {
               language = await api.invoke(api.channels.toMain.detectSystemLanguage)
                console.log('language', language)
            }
            setLanguage(language)
        })()
    }, [])

    useEffect(() => {
        const languagePrefUuid = '941802b4-b837-4eea-b709-d1b002b47e15'
        api.invoke(api.channels.toMain.changePreference, languagePrefUuid, language)

        // Load the correct translation data when language changes
        setTranslations(translationsData[language] || translationsData["en"])
    }, [language])

    const translate = (key: string) => translations[key] || key

    return (
        <TranslationContext.Provider value = {{translate, language, setLanguage}}>
        {
            children
        }
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => useContext(TranslationContext)
