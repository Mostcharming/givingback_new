import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UpdateNGOIcon } from '../assets/images/svgs'
import useBackendService from '../services/backend_service'
import FormModalInput from './form_modal_input'

export default function Donor_Ngo_Dialog({ open, handleClose, id }) {
  const [ngoData, setNgoData] = useState<any>(null)

  const [messageData, setMessageData] = useState({
    subject: '',
    message: ''
  })

  const { mutate: getUSer } = useBackendService('/donor/users', 'GET', {
    onSuccess: (res2: any) => {
      setNgoData(res2.users[0])
    },
    onError: () => {}
  })

  const { mutate: mesasage } = useBackendService(
    `/donor/ngos/${id}/message`,
    'POST',
    {
      onSuccess: (res2: any) => {
        toast.success('Message sent successfully')
        setMessageData({ subject: '', message: '' })
        handleClose()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to send message')
      }
    }
  )

  useEffect(() => {
    getUSer({ organization_id: id })
  }, [id])

  const onInputChange = (value: string, name: string) => {
    setMessageData({
      ...messageData,
      [name]: value
    })
  }

  const closeModal = () => {
    setNgoData(null)
    handleClose()
  }

  const onSubmit = async () => {
    mesasage({ message: messageData })
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
          <DialogTitle>Donor-NGO interaction</DialogTitle>
        </div>
        <DialogContent
          style={{
            width: '449px',
            paddingBottom: '0px'
          }}
        >
          <FormModalInput
            label='Name of Organization'
            type='text'
            initialValue={ngoData?.name || ''}
            onChange={(e) => onInputChange(e.target.value, 'name')}
            disabled={true} // Remove disabled if you want it editable.
          />
          <FormModalInput
            label='Category'
            type='text'
            initialValue={ngoData?.interest_area || ''}
            onChange={(e) => onInputChange(e.target.value, 'interest_area')}
            disabled={true} // Remove disabled if you want it editable.
          />
          <FormModalInput
            label='Subject'
            type='text'
            initialValue={messageData.subject}
            onChange={(e) => onInputChange(e.target.value, 'subject')}
            rows={2}
          />
          <FormModalInput
            label='Message'
            type='textarea'
            initialValue={messageData.message}
            onChange={(e) => onInputChange(e.target.value, 'message')}
            rows={4}
          />
        </DialogContent>
        <DialogActions
          style={{
            padding: '10px'
          }}
        >
          <button className='btn-modal' onClick={onSubmit}>
            Send Message
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
