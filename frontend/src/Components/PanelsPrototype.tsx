import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react'
import 'flexlayout-react/style/dark.css'
import { Button } from './StyledComponents/Button'

const json: IJsonModel = {
    global: {
        tabEnableClose: false,
        tabEnableRename: false,
    },
    borders: [],
    layout: {
        type: 'row',
        weight: 100,
        children: [
            {
                type: 'tabset',
                weight: 50,
                children: [
                    {
                        type: 'tab',
                        name: 'One',
                        component: 'button',
                    },
                ],
            },
            {
                type: 'tabset',
                weight: 50,
                children: [
                    {
                        type: 'tab',
                        name: 'Two',
                        component: 'button',
                    },
                    {
                        type: 'tab',
                        name: 'Three',
                        component: 'button',
                    },
                ],
            },
        ],
    },
}

const model = Model.fromJson(json)

export const PanelsPrototype = () => {
    const factory = (node: TabNode) => {
        const component = node.getComponent()
        if(component === 'button') {
            return <Button>{node.getName()}</Button>
        }
    }

    return <Layout model={model} factory={factory} />
}
