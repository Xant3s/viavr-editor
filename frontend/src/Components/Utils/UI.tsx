import { Checkbox as EvergreenCheckbox } from 'evergreen-ui'
import { ButtonContainer, ModalBackdrop, ModalContent, ModalTitle } from '../StyledComponents/ModalWindow'
import { Button } from '../StyledComponents/Button'
import { useTranslation } from '../../LocalizationContext'

export const Checkbox = ({ id, checked, onChange, label, title = undefined, disabled = undefined }: any) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <EvergreenCheckbox id={id} title={title} checked={checked} onChange={onChange} disabled={disabled}
                               style={{ margin: 3 }} />
            <label htmlFor={id} title={title} style={{ marginLeft: 5 }}>{label}</label>
        </div>
    )
}

export function ModalWindow({ closeModal, onSaveAndContinue, onContinueWithoutSaving, upperTitle }) {
    const {translate, language, setLanguage} = useTranslation()

    return (
        <ModalBackdrop>
            <ModalContent>
                <ModalTitle>{upperTitle}</ModalTitle>
                <ModalTitle>{translate('modalWindow_saveProjectMessage')}</ModalTitle>
                <ButtonContainer>
                    <Button onClick={async () =>{
                        closeModal()
                        onSaveAndContinue()}}>{translate('modalWindow_saveProjectAndContinue')}</Button>
                    <Button onClick={() => {
                        closeModal()
                        onContinueWithoutSaving()}}>{translate('modalWindow_continueWithoutSaving')}</Button>
                    <Button onClick={() => closeModal()}>{translate('modalWindow_cancel')}</Button>
                </ButtonContainer>
            </ModalContent>
        </ModalBackdrop>
    );
}
