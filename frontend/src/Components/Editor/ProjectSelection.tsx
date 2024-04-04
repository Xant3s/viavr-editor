import { useState } from 'react'
import { WelcomeContainer } from './WelcomeContainer'
import { CapturePreferencesContainer } from './CapturePreferencesContainer'
import { TemplateRecommendationContainer } from './TemplateRecommendationContainer'

export const ProjectSelection = ({ hidden, startTutorial }) => {
    const [page, setPage] = useState<'welcome' | 'preferences' | 'recommendation'>('welcome')
    const [preferences, setPreferences] = useState<object>({})

    return (
        <div hidden={hidden}>
            {/*{page === 'welcome' && <WelcomeContainer setPage={setPage} startTutorial={startTutorial}/>}*/}
            {page === 'preferences' && <CapturePreferencesContainer setPage={setPage} setPreferences={setPreferences} />}
            {page === 'recommendation' && <TemplateRecommendationContainer setPage={setPage} preferences={preferences} />}
        </div>
    )
}
