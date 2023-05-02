import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Button, Table, TextInput, TrashIcon } from 'evergreen-ui'
import { useState } from 'react'

export const GameStateEditor = () => {
    const [gameStates, setGameStates] = useState<string[][]>([])

    // TODO: update build settings onLeaveFocus

    const deleteGameState = (index: number) => {
        const lhs = gameStates.slice(0, index)
        const rhs = gameStates.slice(index + 1)
        const newGameStates = [...lhs, ...rhs]
        setGameStates(newGameStates)
    }

    return (
        <SettingAccordion
            summary={'Game States'}
            details={
                <div>
                    <Table>
                        <Table.Head>
                            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Value</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Delete</Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body height={240} minWidth={'600px'}>
                            {gameStates.map(([name, value], index) => (
                                <Table.Row key={index}>
                                    <Table.TextCell>
                                        <TextInput
                                            name="text-input-name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={e =>
                                                setGameStates([
                                                    ...gameStates.slice(0, index),
                                                    [e.target.value, value],
                                                    ...gameStates.slice(index + 1),
                                                ])
                                            }
                                        />
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <TextInput
                                            name="text-input-name"
                                            placeholder="Value"
                                            value={value}
                                            onChange={e =>
                                                setGameStates([
                                                    ...gameStates.slice(0, index),
                                                    [name, e.target.value],
                                                    ...gameStates.slice(index + 1),
                                                ])
                                            }
                                        />
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <Button
                                            iconBefore={TrashIcon}
                                            appearance="minimal"
                                            intent="danger"
                                            onClick={() => deleteGameState(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                        <Button appearance="primary" onClick={() => setGameStates([...gameStates, ['', '']])}>
                            Add New
                        </Button>
                    </div>
                </div>
            }
        />
    )
}
