import { SettingAccordion } from '../../Settings/SettingAccordion'
import { Row } from '../../StyledComponents/Row'
import { Button, TextInputField } from 'evergreen-ui'

export const GameStateEditor = () => {
    return (
        <SettingAccordion
            summary={'Game States'}
            details={
                <div>
                    <SettingAccordion
                        summary={'State1'}
                        details={
                            <Row>
                                <TextInputField label="Name" placeholder="Name..."></TextInputField>
                                <TextInputField label="Value" placeholder="Value..."></TextInputField>
                            </Row>
                        }
                    />

                    <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '20px' }}>
                        <Button
                            appearance="primary"
                            onClick={() => {
                                // TODO implement adding new global states
                            }}
                        >
                            Add new Global State
                        </Button>
                    </div>
                </div>
            }
        />
    )
}
