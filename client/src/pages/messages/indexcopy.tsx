import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { toast } from 'react-toastify'

import { UpdateNGOIcon } from '../../assets/images/svgs'
import FormModalInput from '../../components/form_modal_input'
import { formatDate } from '../../components/formatTime'
import Loading from '../../components/home/loading'
import useBackendService from '../../services/backend_service'
import { useContent } from '../../services/useContext'
import './MessageDonor.css'

function MessageDonor() {
  const [loading, setLoading] = useState(false)
  const [dashBoard, setDashBoard] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [modalShow, setModalShow] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [messageId, setMessageId] = useState(null)

  const { authState } = useContent()

  const { mutate: getMessage } = useBackendService('/donor/messages', 'GET', {
    onSuccess: (res2: any) => {
      setDashBoard(res2)
      const unreadMessages = res2.filter(
        (message: any) => !message.is_read
      ).length
      setUnreadCount(unreadMessages)
    },
    onError: () => {
      toast.error('Unable to fetch messages')
    }
  })
  const { mutate: updateMessage } = useBackendService(
    `/donor/messages/${messageId}`,
    'GET',
    {
      onSuccess: (res2: any) => {
        setDashBoard((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId ? { ...message, is_read: true } : message
          )
        )
        setUnreadCount((prevCount) => prevCount - 1)
      },
      onError: () => {
        toast.error('Failed to mark as read')
      }
    }
  )
  const { mutate: postMessage } = useBackendService(
    '/donor/messages_admin',
    'GET',
    {
      onSuccess: (res2: any) => {},
      onError: () => {}
    }
  )

  const handleSendMessage = async () => {
    try {
      if (!subject.trim()) {
        toast.error('Subject cannot be empty!') // Notify user about the empty subject
        return // Exit the function
      }

      if (!message.trim()) {
        toast.error('Message cannot be empty!') // Notify user about the empty message
        return // Exit the function
      }
      // await sendMessage({ subject, message, userId: auth.user.id }) // Adjust as necessary
      toast.success('Message sent successfully!')
      setSubject('') // Reset fields after sending
      setMessage('')
      setModalShow(false) // Close modal after sending
      // Optionally, fetch updated messages or update local state
      getMessage({ user_id: authState.user.id }) // Fetch dashboard data again
    } catch (error) {
      toast.error('Error sending message: ' + error.message)
    }
  }

  useEffect(() => {
    getMessage({ user_id: authState.user.id })
  }, [])

  useEffect(() => {
    if (messageId !== null) {
      updateMessage({})
    }
  }, [messageId])

  const handleMessageClick = async (messageId: number, isRead: boolean) => {
    if (isRead) {
      // Prevent action for already read messages
      return
    }

    setMessageId(messageId)
  }

  return (
    <>
      {loading && <Loading type={'full'} />}
      {modalShow && <div className='modal-backdrop' />}
      <Dialog
        open={modalShow}
        onClose={() => setModalShow(false)} // Close modal when clicking outside
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
        <DialogTitle>
          Message to the Platform Admin
          <Button
            variant='close'
            onClick={() => setModalShow(false)} // Close button
            style={{ position: 'absolute', right: '16px', top: '16px' }} // Adjust styling as needed
          />
        </DialogTitle>
        <DialogContent
          style={{
            width: '449px',
            paddingBottom: '0px'
          }}
        >
          <FormModalInput
            label='Subject'
            type='text'
            initialValue={subject}
            onChange={(e) => setSubject(e.target.value)} // Correctly handle subject input
            rows={2}
          />
          <FormModalInput
            label='Message'
            type='textarea'
            initialValue={message}
            onChange={(e) => setMessage(e.target.value)} // Correctly handle message input
            rows={4}
          />
        </DialogContent>
        <DialogActions
          style={{
            padding: '10px'
          }}
        >
          <Button className='btn-modal' onClick={handleSendMessage}>
            Send Message
          </Button>
          {/* <Button onClick={() => setModalShow(false)}>Close</Button> */}
        </DialogActions>
      </Dialog>

      <Container fluid>
        {/* Greeting */}
        <Row className='mb-2 justify-content-end'>
          <Button
            onClick={() => setModalShow(true)}
            style={{
              backgroundColor: 'white',
              color: '#7B80DD',
              border: '2px solid #7B80DD',
              padding: '10px 20px',
              borderRadius: '5px'
            }}
          >
            Message the Admin
          </Button>
        </Row>

        <Row className='header'>
          <Col>
            <span className='header-title'>Message Center</span>
          </Col>
          <Col className='unread-messages'>
            <span>
              <span className='yellow-dot' /> {unreadCount} Unread Message(s)
            </span>
          </Col>
        </Row>

        {/* Messages List */}
        <Row className='messages-list'>
          {dashBoard.map((message: any) => (
            <Col md={12} key={message.id} className='message-block'>
              <div
                className={`message-item ${
                  message.is_read ? 'read' : 'unread'
                }`}
                onClick={() => handleMessageClick(message.id, message.is_read)} // Add onClick handler
              >
                <div className='message-bar' />
                <div className='message-content'>
                  <p className='message-subject'>{message.subject}</p>
                  <p>{message.message}</p>
                  <p className='message-date'>
                    {formatDate(message.created_at)}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default MessageDonor
