import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'


export type DeleteDialogResponse = 'abort' | 'delete' | 'deleteFromServer'

interface props {
    open: boolean
    setOpen: (open: boolean) => void
    handleDialog: (response: DeleteDialogResponse) => void
}

export default function AlertDialog({open, setOpen, handleDialog}: props) {
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
                    {'Delete avatar?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        The avatar will be removed from the project and erased from the disk.
                        You can choose to additionally delete the avatar from the avatar server.
                        Deleting the avatar cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handle('abort')}>Abort</Button>
                    <Button onClick={() => handle('delete')} autoFocus>Delete avatar</Button>
                    <Button onClick={() => handle('deleteFromServer')} autoFocus>Delete avatar also from server</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
