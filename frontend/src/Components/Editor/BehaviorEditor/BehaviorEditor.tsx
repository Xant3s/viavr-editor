import { MetaDataEditor } from './MetaDataEditor'
import { GameStateEditor } from './GameStateEditor'
import { QuestLineEditor } from './QuestLineEditor'

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
            <MetaDataEditor />
            <GameStateEditor />
            <QuestLineEditor />
        </div>
    )
}
