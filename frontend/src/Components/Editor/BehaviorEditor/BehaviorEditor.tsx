import { MetaDataEditor } from './MetaDataEditor'
import { VariableEditor } from './VariableEditor'
import { EventsEditor } from './EventsEditor'
import { useTranslation } from '../../../LocalizationContext'

export const BehaviorEditor = ({ hidden }) => {
    const {translate} = useTranslation()
    
    return (
        <div
            hidden={hidden}
            style={{
                backgroundColor: '#3a4048',
                height: 'calc(100vh - 76px)',
                margin: 0,
                padding: 10,
                textAlign: 'center',
                color: 'white',
            }}
        >
            <h1>{translate('behaviorEditor')}</h1>
            <MetaDataEditor isActive={!hidden} />
            <VariableEditor isActive={!hidden}/>
            <EventsEditor hidden={hidden} />
        </div>
    )
}
