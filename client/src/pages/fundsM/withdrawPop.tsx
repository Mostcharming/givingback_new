import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { UpdateNGOIcon } from '../../assets/images/svgs'
import FormModalInput from '../../components/form_modal_input'
import useBackendService from '../../services/backend_service'

export default function Withdraw({ open, handleClose }) {
  const { mutate: sendMessageToNGO, isLoading } = useBackendService(
    `/ngo/withdraw_request`,
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success('Request sent successfully')
        handleClose()
      },
      onError: () => {
        toast.error('Failed to send request. Please try again later.')
      }
    }
  )

  const [messageData, setMessageData] = useState({
    subject: '',
    amount: '',
    message: ''
  })

  const onInputChange = (value: string, name: string) => {
    setMessageData({
      ...messageData,
      [name]: value
    })
  }

  const closeModal = () => {
    handleClose()
  }

  const onSubmit = async () => {
    const { subject, amount, message } = messageData

    // Validation
    if (!subject.trim() || !amount.trim() || !message.trim()) {
      toast.error('All fields are required.')
      return
    }

    try {
      sendMessageToNGO(messageData)
    } catch (error) {
      toast.error(error.message || 'Failed to send request')
    }
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
          <UpdateNGOIcon />
        </div>
        <div className='d-flex justify-content-center'>
          <DialogTitle>Funds Withdrawal Request</DialogTitle>
        </div>
        <DialogContent
          style={{
            width: '449px',
            paddingBottom: '0px'
          }}
        >
          <FormModalInput
            label='Subject'
            type='text'
            initialValue={messageData.subject}
            onChange={(e) => onInputChange(e.target.value, 'subject')}
            rows={2}
          />
          <FormModalInput
            label='Amount'
            type='number'
            initialValue={messageData.amount}
            onChange={(e) => onInputChange(e.target.value, 'amount')}
          />
          <FormModalInput
            label='Message'
            type='textarea'
            initialValue={messageData.message}
            onChange={(e) => onInputChange(e.target.value, 'message')}
            rows={4}
          />
        </DialogContent>
        <div style={{ color: '#878787' }} className='ml-3'>
          Transaction Fee: 1.5% of transaction amount
        </div>
        <DialogActions
          style={{
            padding: '10px'
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: isLoading ? 'none' : 'auto',
              opacity: isLoading ? 0.7 : 1
            }}
            disabled={isLoading}
            className='btn-modal'
            onClick={onSubmit}
          >
            {isLoading ? (
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              ></div>
            ) : (
              'Send Request'
            )}
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
