import { Container, Slide } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { TransitionProps } from '@mui/material/transitions'
import React, { useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useBackendService from '../services/backend_service'
import SuccessModal from './SuccessModal'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='down' ref={ref} {...props} />
})

export default function RespondToBriefModal({ open, handleClose, name, id }) {
  const navigate = useNavigate()
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const messageRef = useRef(null)

  const closeModal = () => {
    handleClose()
  }

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
    closeModal()
    navigate('/ngo/briefs')
  }

  const { mutate: respond } = useBackendService(`/ngo/projects/${id}`, 'PUT', {
    onSuccess: (res2: any) => {
      setIsSuccessModalOpen(true)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = async () => {
    const message = messageRef.current.value

    respond({ message })
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        TransitionComponent={Transition}
        transitionDuration={800}
        sx={{
          '.MuiDialog-container': {
            height: 'auto'
          },
          '.MuiPaper-root': {
            marginTop: '0px'
          }
        }}
      >
        <Container
          style={{
            width: '500px'
          }}
        >
          <div className='d-flex justify-content-start'>
            <DialogTitle className='ps-0 mb-4'>Respond to Brief</DialogTitle>
          </div>

          <h6>Project Title</h6>
          <h5 className='mb-4'>{name}</h5>

          <Form.Group className='mb-4'>
            <Form.Label>
              Please tell us why you want to be a part of this project
            </Form.Label>
            <textarea
              rows={3}
              className='form-control'
              ref={messageRef}
            ></textarea>
          </Form.Group>
          <DialogActions className='mb-4'>
            <button className='btn-brief-response-modal' onClick={handleSubmit}>
              Accept Brief
            </button>
          </DialogActions>
        </Container>
      </Dialog>
      <SuccessModal
        open={isSuccessModalOpen}
        handleClose={closeSuccessModal}
        message={'Brief accepted successfully'}
      />
    </>
  )
}
