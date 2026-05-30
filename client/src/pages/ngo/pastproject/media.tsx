import { useState } from 'react'
import { Button, Col, Form, Image, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../../assets/images/upload.svg'
import Loading from '../../../components/home/loading'
import useBackendService from '../../../services/backend_service'
import Util from '../../../services/utils'
import { usePastProjectContext } from '../add-past-project-context'

const Media = ({ changePage }: { changePage? }) => {
  const { pastProjects, addPastProject } = usePastProjectContext()

  const [image, setImage] = useState<any[] | undefined>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function takePicture() {
    let file = await Util.selectFile('image/*', true)
    if (file) {
      setImage((prevImages) => [...prevImages, file])
    }
  }

  const { mutate: uploadPast } = useBackendService(
    '/ngo/previous-project',
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success('Past Project added successfully')
        setLoading(false)
        navigate('/ngo/projects')
      },
      onError: (error: any) => {
        setLoading(false)
        toast.error(error.response?.data?.error || 'Something went wrong')
      }
    }
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (image && image.length > 0) {
      setLoading(true)

      const formData = new FormData()

      // Append past project data to FormData
      for (let key in pastProjects) {
        formData.append(key, pastProjects[key])
      }
      for (let key in image) {
        formData.append('image', image[key])
      }

      uploadPast(formData)
    } else {
      toast.error('You must upload at least one image')
    }
  }

  const back = () => changePage('Back')

  return (
    <div>
      <Form onSubmit={handleSubmit} id='form'>
        <Row>
          <Col lg='12'>
            <Form.Group className='mb-4'>
              <Form.Label style={{ display: 'block' }}>
                Upload Photos / videos of this project
              </Form.Label>
              <div style={{ display: 'inline-block' }}>
                {image.map((image, index) => (
                  <Image
                    key={index}
                    style={{
                      height: '120px',
                      maxWidth: '200px',
                      borderRadius: '4px',
                      float: 'left',
                      paddingRight: '10px'
                    }}
                    src={URL.createObjectURL(image)}
                  />
                ))}
                <div
                  className='text-center py-3 px-2'
                  onClick={takePicture}
                  style={{
                    float: 'right',
                    backgroundColor: ' #F0F1FB',
                    maxWidth: '200px',
                    height: '120px',
                    marginRight: 'auto',
                    border: 'dashed 2px',
                    borderRadius: '4px',
                    borderColor: 'grey',
                    cursor: 'pointer'
                  }}
                >
                  <div className='text-center'>
                    <img
                      src={upload}
                      alt='camera icon'
                      width='32px'
                      height='32px'
                    />
                  </div>
                  <label
                    className='text-center mt-2'
                    style={{ fontSize: '14px', color: 'grey' }}
                  >
                    Upload image or video
                  </label>
                </div>
              </div>
            </Form.Group>
          </Col>
          <Col lg='12'>
            <div className='mt-5'>
              <div style={{ float: 'right' }}>
                <Button
                  className='px-3 mt-3'
                  style={{ background: '#7B80DD' }}
                  type='button'
                  onClick={back}
                >
                  Back
                </Button>
                <Button
                  className='btn-custom px-3 mt-3 ms-3 text-white'
                  style={{ background: '#7B80DD' }}
                  type='submit'
                >
                  Next
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      {loading && <Loading type={'full'} />}
    </div>
  )
}

export default Media
