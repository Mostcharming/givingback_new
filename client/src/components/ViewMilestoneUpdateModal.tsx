import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useRef } from 'react'

import { Col, Form, Row } from 'react-bootstrap'

interface ViewMilestoneUpdateModalProps {
  open: boolean
  handleClose: () => void
  milestoneUpdate: any
}

export default function ViewMileStoneUpdateModal({
  open,
  handleClose,
  milestoneUpdate
}: ViewMilestoneUpdateModalProps) {
  const narrationRef = useRef(null)

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
        <DialogContent
          style={{
            padding: '0px'
          }}
        >
          <div
            style={{
              backgroundColor: '#F1F2FF',
              padding: '20px',
              marginTop: '20px'
            }}
          >
            <Row>
              <Col lg='4'>
                <Form.Group className='mb-4' style={{ textAlign: 'left' }}>
                  <Form.Label>Actual</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    defaultValue={milestoneUpdate?.achievement}
                    readOnly
                  />
                </Form.Group>
              </Col>
              {/* <Col lg="2">
                <Form.Group className="mb-4" style={{ textAlign: "left" }} controlId="position">
                  <Form.Label>Postion</Form.Label>
                  <Form.Control required type="text" defaultValue={milestoneUpdate?.position} readOnly />
                </Form.Group>
              </Col> */}
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='status'
                >
                  <Form.Label>Status</Form.Label>
                  <Form.Select required defaultValue={milestoneUpdate?.status}>
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
                    defaultValue={milestoneUpdate?.narration}
                    readOnly
                  ></textarea>
                </Form.Group>
              </Col>
            </Row>
          </div>
          <Row className='p-2 mx-0'>
            <Col lg={12}>
              <Form.Group className='mb-4'>
                <Form.Label>Reply</Form.Label>
                <textarea rows={3} className='form-control'></textarea>
              </Form.Group>
            </Col>
          </Row>
        </DialogContent>
        <DialogActions
          style={{
            padding: '20px'
          }}
        >
          <button className='btn-modal'>Submit</button>
        </DialogActions>
      </Dialog>
    </>
  )
}
