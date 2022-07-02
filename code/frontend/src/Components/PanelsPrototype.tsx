import {IJsonModel, Layout, Model, TabNode} from 'flexlayout-react'
import 'flexlayout-react/style/light.css'

const json: IJsonModel = {
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "One",
                        component: "button",
                    }
                ]
            },
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "Two",
                        component: "button",
                    }
                ]
            }
        ]
    }
}

const model = Model.fromJson(json);

export const PanelsPrototype = () => {
    const factory = (node: TabNode) => {
        const component = node.getComponent()
        if(component === "button") {
            return <button>{node.getName()}</button>;
        }
    }

    return <Layout model={model} factory={factory}/>
}
