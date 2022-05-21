import {useEffect, useState} from 'react'

export const HelloWorld = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async() => {
            const response = await window.api.invoke('toMain', '')
            setData(response)
        }

        // getData()
    }, [])

    const foo = () => {
        console.log('foo')
        if(window.api === undefined) {
            // If only React is running without Electron, the context bridge is not available.
            // So create a dummy API object.
            window.api = {
                invoke(channel: string, data: any): Promise<any> {
                    return Promise.resolve(undefined);
                },
                send: () => {},
                on: () => {}
            }
        }
        // window.api.send('toMain', 'foo')

        return data
    }

    return (
        <div>
            <h1>Hello World</h1>
            <p>{foo()}</p>
        </div>
    );
}
