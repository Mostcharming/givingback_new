import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { SuccessIcon } from '../assets/images/svgs'

export default function SuccessModal({ open, handleClose, message }) {
  const closeModal = () => {
    handleClose()
  }

  if (open) {
    setTimeout(() => {
      closeModal()
    }, 3000)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(123, 128, 221, 0.71)'
            }
          }
        }}
      >
        <div className='d-flex justify-content-center mt-3'>
          <SuccessIcon />
        </div>
        <div className='d-flex justify-content-center'>
          <DialogTitle>{message}</DialogTitle>
        </div>
        <DialogActions>
          <button
            className='btn-modal mx-3'
            onClick={handleClose}
            style={{
              borderRadius: '15px'
            }}
          >
            Continue
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
