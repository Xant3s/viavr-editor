import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useTranslation } from '../../../LocalizationContext'

export type DeleteDialogResponse = 'abort' | 'delete' | 'deleteFromServer'

interface props {
    open: boolean
    setOpen: (open: boolean) => void
    handleDialog: (response: DeleteDialogResponse) => void
    avatarIsOnServer: boolean
}

export default function AlertDialog({open, setOpen, handleDialog, avatarIsOnServer}: props) {
    const {translate, language, setLanguage} = useTranslation()

    const handle = (response: DeleteDialogResponse) => {
        handleDialog(response)
        setOpen(false)
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {translate('deleteAvatar')}
                </DialogTitle>
                <DialogContent>
                    {avatarIsOnServer ?
                        <DialogContentText id='alert-dialog-description'>
                            {translate('characterRemovedFromProjectAndDisk')}
                            {translate('deleteFromServerInfo')}
                            {translate('deletingCannotBeUndone')}
                        </DialogContentText>
                        :
                        <DialogContentText id='alert-dialog-description'>
                            {translate('characterRemovedFromProjectAndDisk')}
                            {translate('deletingCannotBeUndone')}
                        </DialogContentText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handle('abort')}>{translate('abort')}</Button>
                    <Button onClick={() => handle('delete')} autoFocus>{translate('deleteCharacter')}</Button>

                    {avatarIsOnServer &&
                        <Button onClick={() => handle('deleteFromServer')} autoFocus>{translate('deleteCharacterFromServer')}</Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    )
}
