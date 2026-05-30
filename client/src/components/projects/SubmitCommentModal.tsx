import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useRef } from 'react'
import { Container, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import '../../assets/css/home/css/modal.css'
import useBackendService from '../../services/backend_service'

interface SubmitCommentModalProps {
  open: boolean
  handleClose: () => void
  comment: string
  projectId: number
}

export default function SubmitCommentModal({
  open,
  handleClose,
  comment,
  projectId
}: SubmitCommentModalProps) {
  const name = useRef(null)
  const phone = useRef(null)

  const closeModal = () => {
    handleClose()
  }

  const { mutate: addCommunityMessage } = useBackendService(
    `/community/${projectId}`,
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success('Comment submitted successfully')
        closeModal()
      },
      onError: (err: any) => {}
    }
  )

  const submitComment = async () => {
    if (name.current.value === '' || phone.current.value === '') {
      toast.error('Please fill all fields')
      return
    }

    const commentData = {
      name: name.current.value,
      phone: phone.current.value,
      message: comment
    }

    addCommunityMessage(commentData)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgb(201, 233, 214, 0.65)'
            }
          }
        }}
      >
        <Container className='px-4 pt-3 comment-modal-body'>
          <div className='d-flex justify-content-start comment-modal-title'>
            <DialogTitle className='ps-0'>
              Hey, we'll like to know you
            </DialogTitle>
          </div>
          <Form.Group className='mb-4'>
            <Form.Control
              type='text'
              placeholder='Name'
              className='mb-3'
              ref={name}
            />
            <Form.Control type='text' placeholder='Phone Number' ref={phone} />
          </Form.Group>
        </Container>
        <DialogActions className='px-4 justify-content-start pt-0'>
          <button
            className='comment_button px-4'
            onClick={submitComment}
            style={{ borderRadius: '50px' }}
          >
            Submit Comment
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
