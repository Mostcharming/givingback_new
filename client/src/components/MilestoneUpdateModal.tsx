import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useRef, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../assets/images/upload.svg'
import useBackendService from '../services/backend_service'
import FileUplaod from './file_upload'

export default function MileStoneUpdateModal({ open, handleClose, id }) {
  const narrationRef = useRef(null)
  const [file, setFile] = useState<File | undefined>(undefined)
  const onSelected = (file: File) => setFile(file)
  const navigate = useNavigate()

  const { mutate: updateMilestone, isLoading } = useBackendService(
    '/ngo/milestone',
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success('Milestone Update added successfully')
        handleClose()
        navigate('/ngo/projects')
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const achievement = event.currentTarget.achievement.value.trim()
    const status = event.currentTarget.status.value
    const narration = narrationRef.current?.value.trim()

    // Validation
    if (!achievement) {
      toast.error('Achievement is required')
      return
    }
    if (!status) {
      toast.error('Status is required')
      return
    }
    if (!narration) {
      toast.error('Narration is required')
      return
    }
    if (!file) {
      toast.error('Please upload an image')
      return
    }

    const formData = new FormData()
    formData.append('achievement', achievement)
    formData.append('status', status)
    formData.append('narration', narration)
    formData.append('image', file)
    formData.append('milestone_id', id)

    updateMilestone(formData)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(123, 128, 221, 0.71)'
            }
          }
        }}
      >
        <div className='d-flex justify-content-center'>
          <DialogTitle className='milestone-modal-title'>
            Milestone Update
          </DialogTitle>
        </div>
        <Form onSubmit={handleSubmit}>
          <DialogContent
            style={{
              paddingBottom: '0px'
            }}
          >
            <Row>
              <Col lg='4'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='achievement'
                >
                  <Form.Label>Actual</Form.Label>
                  <Form.Control required type='text' />
                </Form.Group>
              </Col>
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='status'
                >
                  <Form.Label>Status</Form.Label>
                  <Form.Select required>
                    <option value='Ongoing'>Ongoing</option>
                    <option value='Completed'>Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Group className='mb-4'>
                  <Form.Label>Narration</Form.Label>
                  <textarea
                    rows={3}
                    className='form-control'
                    ref={narrationRef}
                  ></textarea>
                </Form.Group>
              </Col>
            </Row>
          </DialogContent>
          <DialogActions
            style={{
              padding: '20px'
            }}
          >
            <FileUplaod
              file={file}
              width='150px'
              height='50px'
              onFile={onSelected}
              backgroundColor='white'
            >
              <img src={upload} alt='upload icon' width='25px' />
              <label
                className='text-center mb-2 mx-1'
                style={{ fontSize: '13px' }}
              >
                Upload Image
              </label>
            </FileUplaod>
            <button className='btn-modal'>Submit</button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  )
}
