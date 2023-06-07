import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, { Controls, MiniMap, ReactFlowProvider, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { Sidebar } from './Sidebar'
import { BackgroundNode } from './BackgroundNode'
import { Button } from '../StyledComponents/Button'
import triggerImg from './trigger.png'
import noteImg from './note.png'
import { ImageNode } from './ImageNode'
import { TriggerConfigEditor } from './TriggerConfigEditor'
// import './index.css'


const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMjFweCIgaGVpZ2h0PSI2MXB4IiB2aWV3Qm94PSItMC41IC0wLjUgMTIxIDYxIiBjb250ZW50PSImbHQ7bXhmaWxlIGhvc3Q9JnF1b3Q7ZW1iZWQuZGlhZ3JhbXMubmV0JnF1b3Q7IG1vZGlmaWVkPSZxdW90OzIwMjMtMDMtMTRUMTE6NTI6MzYuOTcwWiZxdW90OyBhZ2VudD0mcXVvdDs1LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgdmlhdnItZWRpdG9yLzAuMS4wIENocm9tZS8xMDAuMC40ODk2LjE0MyBFbGVjdHJvbi8xOC4yLjMgU2FmYXJpLzUzNy4zNiZxdW90OyBldGFnPSZxdW90O3ZTSF95eVV0LWU0VW1ucmNhNDc4JnF1b3Q7IHZlcnNpb249JnF1b3Q7MjEuMC42JnF1b3Q7IHR5cGU9JnF1b3Q7ZW1iZWQmcXVvdDsmZ3Q7Jmx0O2RpYWdyYW0gaWQ9JnF1b3Q7Uk1ncVdkUnhnNVN1bDVzZGJfS3YmcXVvdDsgbmFtZT0mcXVvdDtTZWl0ZS0xJnF1b3Q7Jmd0O2paTEJjb01nRUlhZmhydEthcE5yYlpKZWV2TFFNeU5iWVFyaUVJemFweStVSmVvNG5lbkYyZjMrWGRuOWdkQktUMWZMZXZGdU9DaFNaSHdpOUpVVVJYazYrbThBTTRLUUJkQmF5U1BLRjFETGIwQ1lJUjBraDl1bTBCbWpuT3kzc0RGZEI0M2JNR2F0R2JkbG4wWnRUKzFaQ3p0UU4wenQ2WWZrVGtSNkxKNFgvZ2F5RmVua3ZEeEZSYk5Vakp2Y0JPTm1YQ0Y2SnJTeXhyZ1k2YWtDRmJ4THZzUyt5eC9xWXpBTG5mdFBBNDBOZDZZRzNLMVNzdm55U0lBRm5OSE5hWEZyaG81RDZNMElmUm1GZEZEM3JBbnE2Ry9hTStHMDhsbnV3LzBzT040ZHJJTnBoWEMyS3hnTnpzNitCRlg2ZElndCtGQU9KZm8yTHJibnlVdXhzanpWTWJ6cDl2SHJ4UXdmb0I4cFhYei8xVmFQbDU1L0FBPT0mbHQ7L2RpYWdyYW0mZ3Q7Jmx0Oy9teGZpbGUmZ3Q7Ij48ZGVmcy8+PGc+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2MCIgZmlsbD0icmdiKDI1NSwgMjU1LCAyNTUpIiBzdHJva2U9InJnYigwLCAwLCAwKSIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxzd2l0Y2g+PGZvcmVpZ25PYmplY3QgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHJlcXVpcmVkRmVhdHVyZXM9Imh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjRXh0ZW5zaWJpbGl0eSIgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxMThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAzMHB4OyBtYXJnaW4tbGVmdDogMXB4OyI+PGRpdiBkYXRhLWRyYXdpby1jb2xvcnM9ImNvbG9yOiByZ2IoMCwgMCwgMCk7ICIgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7Ij48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6IHJnYigwLCAwLCAwKTsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgb3ZlcmZsb3ctd3JhcDogbm9ybWFsOyI+Q2xpY2sgaGVyZTwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48dGV4dCB4PSI2MCIgeT0iMzQiIGZpbGw9InJnYigwLCAwLCAwKSIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxMnB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DbGljayBoZXJlPC90ZXh0Pjwvc3dpdGNoPjwvZz48L2c+PHN3aXRjaD48ZyByZXF1aXJlZEZlYXR1cmVzPSJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0V4dGVuc2liaWxpdHkiLz48YSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01KSIgeGxpbms6aHJlZj0iaHR0cHM6Ly93d3cuZGlhZ3JhbXMubmV0L2RvYy9mYXEvc3ZnLWV4cG9ydC10ZXh0LXByb2JsZW1zIiB0YXJnZXQ9Il9ibGFuayI+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMHB4IiB4PSI1MCUiIHk9IjEwMCUiPlRleHQgaXMgbm90IFNWRyAtIGNhbm5vdCBkaXNwbGF5PC90ZXh0PjwvYT48L3N3aXRjaD48L3N2Zz4='
const floorMapConfigSettingsName = 'floorMapConfig'

const initialNodes = [
    {
        id: '1',
        type: 'background',
        data: { label: defaultImage },
        position: { x: 0, y: 0 },
        selectable: false,
        deletable: false,
    }
]

let id = 0
const getId = () => `dndnode_${id++}`



export const TriggerEditor = () => {
    const [showNoteConfigEditor, setShowNoteConfigEditor] = useState(false)
    const [activeNoteId, setActiveNoteId] = useState('')
    const [floorMapSrc, setFloorMapSrc] = useState('')
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
    const nodeTypes = useMemo(() => ({ background: BackgroundNode, image: ImageNode }), [])


    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()

            // @ts-ignore
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const type = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if(typeof type === 'undefined' || !type) {
                return
            }

            // @ts-ignore
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })

            let nodeType = type
            if(type === 'trigger') nodeType = 'image'
            const id = getId()

            const newNode = {
                id: id,
                type: nodeType,
                position,
                data: {
                    label: triggerImg.toString(), // img source
                    id: id,
                    type: type,
                    sceneObject: '',
                    triggerType: '',
                    triggerValue: '',
                    showNoteConfigEditor: showNoteEditor,
                },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance, setNodes],
    )

    const deleteNode = (elementsToRemove) => {
        setNodes((elements) => elements.filter((el) => !elementsToRemove.includes(el)))
    }

    const save = useCallback(async () => {
        if(reactFlowInstance) {
            const flow = reactFlowInstance.toObject()
            flow.nodes = flow.nodes.map((node) => {
                delete node.data.showNoteConfigEditor // delete non-serializable data
                return node
            })
            await api.invoke(api.channels.toMain.setBuildSetting, floorMapConfigSettingsName, flow)
            const triggers = flow.nodes.slice(1).map((node) => {
                return {
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data,
                }
            })
            await api.invoke(api.channels.toMain.setBuildSetting, 'floorMapTriggers', triggers)
            flow.nodes = flow.nodes.map((node) => {
                node.data.showNoteConfigEditor = showNoteEditor // Restore
                return node
            })
        }
    }, [reactFlowInstance])

    const restore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = await api.invoke(api.channels.toMain.getBuildSetting, floorMapConfigSettingsName)
            if(flow !== undefined) {
                flow.nodes = flow.nodes.map((node) => {node.data.showNoteConfigEditor = showNoteEditor; return node})
                setNodes(flow.nodes || [])
            }
        }
        restoreFlow()
    }, [setNodes])

    useEffect(() => {
        const loadFloorMap = async () => {
            const floorMap = await api.invoke(api.channels.toMain.floorMapGetSvg)
            setFloorMapSrc(floorMap)
            setNodes((nodes) => {
                    nodes.map((node) => {
                        if(node.id === '1') {
                            node.data = {
                                ...node.data,
                                label: floorMap,
                            }
                        }
                        return node
                    })
                    return [...nodes] // create a clone of nodes to force re-render
                },
            )

            return () => {
                api.removeListeners(api.channels.toMain.floorMapGetSvg)
            }
        }

        restore()
        loadFloorMap()
    }, [setNodes, restore])

    useEffect(() => {
        if(reactFlowInstance) {
            reactFlowInstance.setCenter(0, 0)
        }
    }, [reactFlowInstance])

    const showNoteEditor = (id) => {
        setShowNoteConfigEditor(true)
        setActiveNoteId(id)
    }

    const getNodeData = (key) => {
        return nodes.find((node) => node.id === activeNoteId)?.data[key]
    }

    const editNodeData = (key, value) => {
        setNodes(nodes => {
            nodes.map(node => {
                if(node.id === activeNoteId) {
                    node.data = {
                        ...node.data,
                        // @ts-ignore
                        [key]: value,
                    }
                }
                return node
            })
            return [...nodes] // create a clone of nodes to force re-render
        })
    }

    return (
        <div className='dndflow'>
            <div style={{textAlign: 'center', zIndex: 4}}>
            <Button onClick={save}>Save</Button>
            <Button onClick={restore}>Restore</Button>
            </div>
            <ReactFlowProvider>
                <Sidebar />
                <div className='reactflow-wrapper' ref={reactFlowWrapper}
                     style={{ width: '100vw', height: 'calc(100vh - 102px)' }}>
                    <ReactFlow
                        nodes={nodes}
                        nodeTypes={nodeTypes}
                        onNodesDelete={deleteNode}
                        onNodesChange={onNodesChange}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        style={{ backgroundImage: `${floorMapSrc}`,
                            backgroundPosition: 'bottom left',
                            backgroundAttachment: 'bottom left',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative',
                            height: '100%',
                            width: '100%',}}
                    >
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
            <TriggerConfigEditor isOpen={showNoteConfigEditor}
                                 close={() => setShowNoteConfigEditor(false)}
                                 sceneObject={getNodeData('sceneObject')}
                                 setSceneObject={(sceneObject) => editNodeData('sceneObject', sceneObject)}
                                 triggerValue={getNodeData('triggerValue')}
                                 setTriggerValue={(triggerValue) => editNodeData('triggerValue', triggerValue)}
                                 triggerType={getNodeData('triggerType')}
                                 setTriggerType={(triggerType) => editNodeData('triggerType', triggerType)}
            />
        </div>
    )
}