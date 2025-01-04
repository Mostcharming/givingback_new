import { useState } from 'react'
import { toast } from 'react-toastify'
import useBackendService from '../../services/backend_service'
import Util from '../../services/utils'

interface CommentCardProps {
  message: any
}

export default function CommentCard({ message }: CommentCardProps) {
  const [messages, setMessages] = useState<any>(message)

  const { mutate: likeCommunityMessage } = useBackendService(
    `/community/${message.id}`,
    'PATCH',
    {
      onSuccess: (res: any) => {
        setMessages((prevMessage) => ({
          ...prevMessage,
          likes: prevMessage.likes + 1
        }))
      },
      onError: (err: any) => {
        toast.error(err.response.data.error)
      }
    }
  )
  const { mutate: dislikeCommunityMessage } = useBackendService(
    `/community/${message.id}`,
    'PUT',
    {
      onSuccess: (res: any) => {
        setMessages((prevMessage) => ({
          ...prevMessage,
          reactions: prevMessage.reactions + 1
        }))
      },
      onError: (err: any) => {
        toast.error(err.response.data.error)
      }
    }
  )

  const like = async () => {
    likeCommunityMessage({})
  }

  const dislike = async () => {
    dislikeCommunityMessage({})
  }

  return (
    <>
      <div className='user-replies__area'>
        <div className='user-replies__area--container'>
          <div className='user-reply__info'>
            <img
              className='user_img'
              src='./src/assets/images/home/user-comment.svg'
            />
            <div>
              <p className='user__name'>{messages.name}</p>
              <p className='comment__date'>
                {Util.formatDate(messages.createdAt)}
              </p>
            </div>
          </div>
          <div className='reactions__container'>
            <div
              className='reactions__container--emoji'
              style={{ cursor: 'pointer' }}
              onClick={like}
            >
              <span>{messages.likes}</span>
              <img src='./src/assets/images/home/clap-hand.svg' />
            </div>
            <div
              className='reactions__container--emoji'
              style={{ cursor: 'pointer' }}
              onClick={dislike}
            >
              <span>{messages.reactions}</span>
              <img src='./src/assets/images/home/bad-comment.svg' />
            </div>
          </div>
        </div>
        <div className='reply__container'>{messages.messages}</div>
      </div>
    </>
  )
}
