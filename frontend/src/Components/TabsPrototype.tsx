import { Button } from './StyledComponents/Button'
import { useState } from 'react'

export const TabsPrototype = () => {
    const [id, setId] = useState(0)

    const getComponent = (id: number) => {
        switch(id) {
            case 0:
                return <TestComponent title={'Test Component 1'} />
            case 1:
                return <TestComponent title={'Test Component 2'} />
            case 2:
                return <TestComponent title={'Test Component 3'} />
            case 3:
                return <TestComponent title={'Test Component 4'} />
        }
    }

    return <>
        <Header setId={setId} />
        {getComponent(id)}
    </>
}

export const Header = ({ setId }) => {
    return <div style={{ textAlign: 'center', backgroundColor: '#15171b' }}>
        <div style={{ padding: 5, display: 'inline-block' }}>
            <Button onClick={() => setId(0)}>One</Button>
            <Button onClick={() => setId(1)}>Two</Button>
            <Button onClick={() => setId(2)}>Three</Button>
            <Button onClick={() => setId(3)}>Four</Button>
        </div>
    </div>
}

export const TestComponent = ({ title }) => {
    return <div style={{ backgroundColor: '#3a4048', height: '100vh', margin: 0, padding: 10, textAlign: 'center' }}>
        <h1 style={{ color: 'white' }}>{title}</h1>
    </div>
}
