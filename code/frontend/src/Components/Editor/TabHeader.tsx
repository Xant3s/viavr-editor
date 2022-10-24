import {Button} from '../StyledComponents/Button'

export const TabHeader = ({setId}) => {
    return <div style={{textAlign: 'center', backgroundColor: '#15171b'}}>
        <div style={{padding: 5, display: 'inline-block'}}>
            <Button onClick={() => setId(1)}>Objects</Button>
            <Button onClick={() => setId(2)}>Behaviors</Button>
            <Button onClick={() => setId(3)}>Avatars</Button>
            <Button onClick={() => setId(4)}>Articy</Button>
            <Button onClick={() => setId(5)}>Share</Button>
        </div>
    </div>
}
