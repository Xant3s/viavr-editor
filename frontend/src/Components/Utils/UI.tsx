import { Checkbox as EvergreenCheckbox } from 'evergreen-ui'
import { ButtonContainer, ModalBackdrop, ModalContent, ModalTitle } from '../StyledComponents/ModalWindow'
import { Button } from '../StyledComponents/Button'

export const Checkbox = ({ id, checked, onChange, label, title = undefined, disabled = undefined }: any) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <EvergreenCheckbox id={id} title={title} checked={checked} onChange={onChange} disabled={disabled}
                               style={{ margin: 3 }} />
            <label htmlFor={id} title={title} style={{ marginLeft: 5 }}>{label}</label>
        </div>
    )
}

 export function ModalWindow({ closeModal, onSaveAndContinue, onContinueWithoutSaving, upperTitle}) {
    return (
        <ModalBackdrop>
            <ModalContent>
                <ModalTitle>{upperTitle}</ModalTitle>
                <ModalTitle>Save the project now?</ModalTitle>
                <ButtonContainer>
                    <Button onClick={async () =>{
                        closeModal()
                        onSaveAndContinue()}}>Save Project and Continue</Button>
                    <Button onClick={() => {
                        closeModal()
                        onContinueWithoutSaving()}}>Continue without Saving</Button>
                    <Button onClick={() => closeModal()}>Cancel</Button>
                </ButtonContainer>
            </ModalContent>
        </ModalBackdrop>
    );
}
