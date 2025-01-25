import { useEffect, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Col, Container, Row } from 'reactstrap'
import NGOKYCDetail from '../components/ngo-detail-kyc'
import NGOPastProjectsDetail from '../components/ngo-detail-past-projects'
import NGOProfileDetail from '../components/ngo-detail-profile'
import usePageChange from '../components/pageChange'
import NGOTransaction from '../components/transation'
import useBackendService from '../services/backend_service'
import { useContent } from '../services/useContext'

function NGODetails() {
  const { authState } = useContent()
  const { page, setPageNumber } = usePageChange()
  const [ngoData, setNgoData] = useState<any>()
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState(ngoData?.active ? 1 : 0)

  const { mutate: getUSer } = useBackendService('/donor/users', 'GET', {
    onSuccess: (res2: any) => {
      setNgoData(res2.users[0])
      setActiveStatus(res2.users[0].active)
    },
    onError: () => {}
  })

  const { mutate: updateUser } = useBackendService(
    `/admin/users/${id}`,
    'POST',
    {
      onSuccess: (res2: any) => {
        toast.success('NGO status updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )

  useEffect(() => {
    getUSer({ organization_id: id })
  }, [id])

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const updatedActiveStatus = Number(e.target.value)
    setActiveStatus(updatedActiveStatus)

    const updatedNgoData = { active: updatedActiveStatus }

    updateUser(updatedNgoData)
  }

  const handleCancel = () => {
    const role = authState.user?.role
    switch (role) {
      case 'admin':
        navigate('/admin/ngo_directory') // Redirect to admin briefs
        break
      case 'donor':
      case 'corporate':
        navigate('/donor/ngo_directory') // Redirect to donor briefs
        break
      default:
        console.log('Invalid role or no role found')
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <span
            className='d-flex justify-content-end gap-1'
            style={{ alignItems: 'center' }}
          >
            {authState.user?.role === 'admin' && (
              <div style={{ position: 'relative' }}>
                <select
                  value={activeStatus}
                  onChange={handleStatusChange}
                  className='ms-2'
                  style={{
                    border: '1px solid #7b80dd',
                    borderRadius: '3px',
                    padding: '5px 30px 5px 10px',
                    outline: 'none',
                    appearance: 'none'
                  }}
                >
                  <option value=''>Update Status</option>
                  <option value={0}>Inactive</option>
                  <option value={1}>Active</option>
                </select>
                <FaFilter
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#7b80dd'
                  }}
                />
              </div>
            )}
            <div
              className='p-2'
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              onClick={handleCancel}
            >
              <svg
                width='32'
                height='32'
                viewBox='0 0 44 44'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='22'
                  cy='22'
                  r='21.5'
                  fill='#E3E5FB'
                  stroke='#7B80DD'
                />
                <path
                  d='M29.7782 13.7782C30.1408 14.1408 30.106 14.7733 29.7171 15.244L29.621 15.3495L23.4142 21.5563L29.621 27.7632C30.0983 28.2405 30.1687 28.944 29.7782 29.3345C29.4155 29.6972 28.783 29.6624 28.3124 29.2734L28.2068 29.1774L22 22.9706L15.7932 29.1774C15.3159 29.6547 14.6123 29.725 14.2218 29.3345C13.8592 28.9719 13.894 28.3394 14.2829 27.8687L14.379 27.7632L20.5858 21.5563L14.379 15.3495C13.9017 14.8722 13.8313 14.1687 14.2218 13.7782C14.5845 13.4155 15.217 13.4503 15.6876 13.8393L15.7932 13.9353L22 20.1421L28.2068 13.9353C28.6841 13.458 29.3877 13.3877 29.7782 13.7782Z'
                  fill='#7B80DD'
                />
              </svg>
            </div>
          </span>
        </Col>
      </Row>
      <Row
        style={{
          backgroundColor: '#7B80DD',
          color: '#fff',
          borderRadius: '3px',
          marginLeft: '0px'
        }}
      >
        <Col md={1}>
          <Row>
            <Col md={6} className='mt-2'>
              <span>#{ngoData && ngoData.id}</span>
            </Col>
            <Col md={6}>
              <div className='vr'></div>
            </Col>
          </Row>
        </Col>
        <Col md={11}>
          <p className='mt-2'>{ngoData && ngoData.name}</p>
        </Col>
      </Row>
      <Container className='w-50 ms-0 mt-3'>
        <Row>
          <Col>
            <div
              className={`${
                page === 1 && 'ngo-directory-active-header'
              } cursor-pointer text-center`}
              onClick={() => setPageNumber(1)}
            >
              Profile
            </div>
          </Col>

          <Col>
            <div
              className={`${
                page === 3 && 'ngo-directory-active-header'
              } cursor-pointer`}
              onClick={() => setPageNumber(3)}
            >
              Past Projects
            </div>
          </Col>

          {authState.user?.role === 'admin' && (
            <>
              <Col>
                <div
                  className={`${
                    page === 2 && 'ngo-directory-active-header'
                  } cursor-pointer`}
                  onClick={() => setPageNumber(2)}
                >
                  KYC Details
                </div>
              </Col>
              <Col>
                <div
                  className={`${
                    page === 4 && 'ngo-directory-active-header'
                  } cursor-pointer`}
                  onClick={() => setPageNumber(4)}
                >
                  Transactions
                </div>
              </Col>
            </>
          )}
        </Row>
      </Container>

      {page === 1 && ngoData && <NGOProfileDetail ngoData={ngoData} />}
      {page === 2 && ngoData && <NGOKYCDetail ngoData={ngoData} />}
      {page === 3 && ngoData && <NGOPastProjectsDetail id={ngoData.id} />}
      {page === 4 && ngoData && <NGOTransaction id={ngoData.id} />}
    </Container>
  )
}

export default NGODetails
