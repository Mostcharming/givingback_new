import { useEffect, useState } from 'react'
import { Form, Table } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'

import Select from 'react-select'
import { toast } from 'react-toastify'
import { formatDate } from '../components/formatTime'
import Loading from '../components/home/loading'
import Tables from '../components/tables'
import useBackendService from '../services/backend_service'
import { capitalizeFirstLetter } from '../services/capitalize'
import { useContent } from '../services/useContext'

const New = () => {
  const [ngos, setNgos] = useState([])
  const [selectedNgo, setSelectedNgo] = useState(null)
  const [recipientName, setRecipientName] = useState('')
  const { currentState } = useContent()

  const { mutate: fetchUsers } = useBackendService('/donor/users', 'GET', {
    onSuccess: (res: any) => {
      setNgos(res.users.map((ngo) => ({ value: ngo.id, label: ngo.name })))
    },
    onError: (error) => {
      toast.error('Failed to fetch NGOs.')
    }
  })

  const { mutate: Addreci, isLoading } = useBackendService(
    '/donor/beneficiary',
    'POST',
    {
      onSuccess: (res: any) => {},
      onError: (error) => {
        toast.error('Failed to fetch NGOs.')
      }
    }
  )

  useEffect(() => {
    fetchUsers({ limit: 10000 })
  }, [])

  const submitRecipient = async (recipientData) => {
    try {
      Addreci(recipientData)
      setRecipientName('')
      setSelectedNgo(null)
    } catch (error) {
      toast.error('Failed to add recipient. Please try again.') // Show error toast
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedNgo && recipientName) {
      await submitRecipient({
        ngoId: selectedNgo.value,
        name: recipientName,
        donorId: currentState.user.id
      })
    }
  }

  return (
    <form className='p-4 bg-white' onSubmit={handleSubmit}>
      <Row>
        <Col lg='7'>
          <Form.Group className='mb-1' controlId='recipientWalletNumber'>
            <Form.Label>Select NGO</Form.Label>
            <Select
              options={ngos}
              onChange={setSelectedNgo}
              placeholder='Search for NGO...'
              isClearable
              isSearchable
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg='7'>
          <Form.Group className='mb-4' controlId='recipientName'>
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              type='text'
              required
              placeholder='Enter name'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg='7'>
          <button style={{ width: 'auto' }} className='btn-modal' type='submit'>
            Add Recipient
          </button>
        </Col>
      </Row>
    </form>
  )
}

const Saved = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(true)

  const { mutate: fetchUsers } = useBackendService(
    '/donor/beneficiary',
    'GET',
    {
      onSuccess: (res: any) => {
        setBeneficiaries(res)
        setLoading(false)
      },
      onError: (error) => {
        toast.error('Failed to fetch NGOs.')
        setLoading(false)
      }
    }
  )

  useEffect(() => {
    fetchUsers({})
  }, [])

  if (loading) {
    return <p>Loading beneficiaries...</p>
  }

  return (
    <div className='mt-4'>
      <Table responsive>
        <thead>
          <tr>
            <th style={{ background: '#F0F1FB' }}>Beneficiary</th>
            <th style={{ background: '#F0F1FB' }}>Thematic area</th>
            <th style={{ background: '#F0F1FB' }}>Website</th>
            <th style={{ background: '#F0F1FB' }}>Location</th>
            <th style={{ background: '#F0F1FB' }}>Telephone</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.id}>
              <td>{beneficiary.name}</td>
              <td>{beneficiary.interest_area}</td>
              <td>{beneficiary.website}</td>
              <td>
                {beneficiary.city_lga}-{beneficiary.state}
              </td>
              <td>{beneficiary.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const Send = () => {
  const [beneficiaries, setBeneficiaries] = useState([]) // List of beneficiaries
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null) // Selected beneficiary
  const [projects, setProjects] = useState([]) // Projects associated with selected beneficiary
  const [amount, setAmount] = useState('') // Payment amount
  const [description, setDescription] = useState('') // Payment description
  const [selectedProject, setSelectedProject] = useState(null) // Selected project
  const { authState } = useContent()
  const { mutate: fetchUsers } = useBackendService(
    '/donor/beneficiary',
    'GET',
    {
      onSuccess: (res: any) => {
        setBeneficiaries(
          res.map((beneficiary) => ({
            value: beneficiary.user_id,
            label: beneficiary.name
          }))
        )
      },
      onError: (error) => {
        toast.error('Failed to fetch beneficiaries:')
      }
    }
  )

  const { mutate: Donate, isLoading } = useBackendService(
    '/donor/beneficiary',
    'PUT',
    {
      onSuccess: (res: any) => {
        toast.success('Donation made successfully')
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || 'Submission failed')
      }
    }
  )

  const { mutate: fetchUsersD } = useBackendService(
    `/donor/users/${selectedBeneficiary?.value}/projects`,
    'GET',
    {
      onSuccess: (res: any) => {
        setProjects(
          res.projects.map((project) => ({
            value: project.id,
            label: project.title
          }))
        )
      },
      onError: (error) => {
        toast.error('Failed to fetch beneficiaries:')
      }
    }
  )

  // Fetch beneficiaries on component mount
  useEffect(() => {
    fetchUsers({})
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedBeneficiary) {
        try {
          fetchUsersD({ id: selectedBeneficiary.value })
        } catch (error) {
          console.error('Failed to fetch projects:', error)
        }
      }
    }

    fetchProjects()
  }, [selectedBeneficiary])

  const handleSendMoney = async (e) => {
    e.preventDefault()

    if (selectedBeneficiary && selectedProject && amount && description) {
      Donate({
        amount,
        project_id: selectedProject.value,
        ngo_id: selectedBeneficiary.value,
        donor_id: authState.user.id
      })
      // selectedBeneficiary.value,
      // selectedProject.value,
      // amount, // amount
      // userId // donor_id
      // )
    } else {
      toast.error('Please fill in all fields.')
    }
  }

  return (
    <div className='p-4 bg-white'>
      <form onSubmit={handleSendMoney}>
        <Row>
          <Col lg='7'>
            <Form.Group className='mb-1' controlId='recipientWalletNumber'>
              <Form.Label>Select Beneficiary</Form.Label>
              <Select
                options={beneficiaries}
                onChange={setSelectedBeneficiary}
                placeholder='Search for Beneficiary...'
                isClearable
                isSearchable
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg='7'>
            <Form.Group className='mb-4' controlId='amount'>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type='number'
                required
                placeholder='Enter Amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg='7'>
            <Form.Group className='mb-4' controlId='description'>
              <Form.Label>Payment Description</Form.Label>
              <Form.Control
                type='text'
                required
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg='7'>
            <Form.Group className='mb-4' controlId='fundedProject'>
              <Form.Label>Funded Project</Form.Label>
              <Select
                options={projects}
                onChange={setSelectedProject}
                placeholder='Select a project'
                isClearable
                isSearchable
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg='7'>
            <button
              style={{ width: 'auto' }}
              className='btn-modal'
              type='submit'
              disabled={isLoading}
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
                'Send Money'
              )}
            </button>
          </Col>
        </Row>
      </form>
    </div>
  )
}

const Trans = () => {
  const { currentState } = useContent()
  const [TableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [TableActions, setTableActions] = useState([])
  const [Tableheaders, setTableHeaders] = useState([
    'Project',
    'Description',
    'Type',
    'Amount',
    'Date'
  ])

  const { mutate: getTableData } = useBackendService(
    '/admin/transactions',
    'GET',
    {
      onSuccess: (res: any) => {
        const filteredData =
          res.donations
            ?.filter((project: any) => project.id) // Remove users without an id
            .map((project: any) => ({
              id: project.id,
              Project: project.project_name, // Adjust field name if necessary
              Description: project.project_description, // Adjust field name if necessary
              Type: capitalizeFirstLetter(project.type), // Adjust field name if necessary
              Amount: `NGN ${project.amount}`,
              Date: formatDate(project.createdAt)
            })) || []
        // Update the table data with filtered data
        setTableData(filteredData)
        setTotalPages(res.totalPages || 1)
      },
      onError: () => {
        toast.error('Error getting projects data')
      }
    }
  )
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  useEffect(() => {
    getTableData({
      page: currentPage,
      limit: 10,
      donor_id: currentState.user.id
    })
  }, [currentPage])

  const handleEmptyStateClick = () => {}

  return (
    <Tables
      tableName='Donor Transactions'
      headers={Tableheaders}
      data={TableData}
      isPagination={true}
      actions={TableActions}
      emptyStateContent='No Transactions available'
      emptyStateButtonLabel=''
      onEmptyStateButtonClick={handleEmptyStateClick}
      // filter={}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}

function SendMoney() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('new')

  const renderForm = () => {
    switch (activeTab) {
      case 'new':
        return <New />
      case 'saved':
        return <Saved />
      case 'send':
        return <Send />
      case 'trans':
        return <Trans />
      default:
        return <New />
    }
  }

  const renderTabs = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
        className='tabs'
      >
        <Tab
          label='Add a new Recipient'
          active={activeTab === 'new'}
          onClick={() => setActiveTab('new')}
        />
        <Tab
          label='Saved Beneficiaries'
          active={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
        />
        <Tab
          label='Send Money'
          active={activeTab === 'send'}
          onClick={() => setActiveTab('send')}
        />
        <Tab
          label='Transaction History'
          active={activeTab === 'trans'}
          onClick={() => setActiveTab('trans')}
        />
      </div>
    )
  }

  return (
    <>
      {loading && <Loading type={'full'} />}
      <Container fluid>
        <div style={{ borderBottom: '2px solid grey', margin: '10px 0' }} />
        <Row>
          <Container className='b'>
            {renderTabs()}
            <div className='form-container'>{renderForm()}</div>
          </Container>
        </Row>
      </Container>
    </>
  )
}

const Tab: React.FC<{
  label: string
  active: boolean
  onClick?: () => void
}> = ({ label, active, onClick }) => (
  <span
    className={`tab ${active ? 'active' : ''}`}
    onClick={onClick}
    style={tabStyle(active)}
  >
    {label}
  </span>
)

const tabStyle = (isActive: boolean) => ({
  flex: 1,
  padding: '10px 22px',
  cursor: 'pointer',
  background: '#7b80dd80',
  color: 'white',
  borderBottom: isActive ? '2px solid purple' : '2px solid transparent',
  fontWeight: isActive ? 600 : 400
})

export default SendMoney
