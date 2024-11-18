import { MetaDataEditor } from './MetaDataEditor'
import { VariableEditor } from './VariableEditor'
import { EventsEditor } from './EventsEditor'

export const BehaviorEditor = ({ hidden }) => {
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
            <h1>Behavior Editor</h1>
            <MetaDataEditor isActive={!hidden} />
            <VariableEditor isActive={!hidden}/>
            <EventsEditor hidden={hidden} />
        </div>
    )
}
