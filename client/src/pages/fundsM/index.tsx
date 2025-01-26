import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Container } from 'reactstrap'
import DashBox from '../../components/dashbox'
import { formatDate } from '../../components/formatTime'
import Tables from '../../components/tables'
import useBackendService from '../../services/backend_service'
import { capitalizeFirstLetter } from '../../services/capitalize'
import { useContent } from '../../services/useContext'
import Withdraw from './withdrawPop'

const FundsM = () => {
  const { authState, currentState } = useContent()
  const navigate = useNavigate()
  const [dashBoxItems, setDashBoxItems] = useState([])
  const [tableData, setTableData] = useState([])
  const [headers, setHeaders] = useState([])
  const [actions, setActions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = async () => {
    setIsModalOpen(false)
  }
  const openModal = () => {
    setIsModalOpen(true)
  }

  const role = authState.user?.role

  // Fetching dashboard details
  const { mutate: getDash } = useBackendService('/donor/dashboard', 'GET', {
    onSuccess: (res) => {
      const items = getDashBoxItems(role, res)
      setDashBoxItems(items)
    },
    onError: () => {
      toast.error('Error getting Dashboard details')
    }
  })

  const { mutate: getDashAdmin } = useBackendService(
    '/admin/dashboard',
    'GET',
    {
      onSuccess: (res) => {
        const items = getDashBoxItems(role, res)
        setDashBoxItems(items)
      },
      onError: () => {
        toast.error('Error getting Dashboard details')
      }
    }
  )

  // Fetching table data
  const { mutate: getTableData } = useBackendService(
    '/admin/transactions',
    'GET',
    {
      onSuccess: (res: any) => {
        const filteredData =
          res.donations?.map((project: any) => ({
            id: project.id,
            title: capitalizeFirstLetter(project.project_name), // Adjust field name if necessary
            description: capitalizeFirstLetter(project.project_description), // Adjust field name if necessary
            amount: project.amount, // Adjust field name if necessary
            type: capitalizeFirstLetter(project.type),
            status: capitalizeFirstLetter(project.status) ?? 'Completed',
            dateTime: formatDate(project.createdAt) // Adjust field name if necessary
          })) || []

        // Update the table data with filtered data
        setTableData(filteredData)
        setupTableAttributes(role)
      },
      onError: () => {
        setupTableAttributes(role)

        toast.error('Error getting projects data')
      }
    }
  )
  console.log(tableData)
  useEffect(() => {
    if (authState.user?.role === 'admin') {
      getDashAdmin({})
      getTableData({})
    } else if (
      authState.user?.role === 'donor' ||
      authState.user?.role === 'corporate'
    ) {
      getDash({})
      getTableData({ projectType: 'present', donor_id: currentState?.user.id })
    } else if (authState.user?.role === 'NGO') {
      getDash({})
      getTableData({
        projectType: 'present',
        ngo_id: currentState?.user.id
      })
    }
  }, [authState.user?.role])

  const getDashBoxItems = (role, data: any) => {
    // Return dash box items based on role
    switch (role) {
      case 'NGO':
        return [
          {
            title: 'Wallet Balance',
            amount: data.walletBalance,
            iconClass: 'fas fa-wallet',
            bgColor: 'bg-primary'
          },
          {
            title: 'Ongoing Projects',
            amount: data.activeProjectsCount,
            iconClass: 'fas fa-spinner',
            bgColor: 'bg-info'
          },

          {
            title: 'Donations Received',
            amount: data.totalDonations,
            iconClass: 'fas fa-hand-holding-usd',
            bgColor: 'bg-warning'
          },
          {
            title: 'Current Funding',
            amount: '₦0.00',
            iconClass: 'fas fa-check-circle',
            bgColor: 'bg-success'
          }
        ]
      case 'donor':
      case 'corporate':
        return [
          {
            title: 'Wallet Balance',
            amount: data.walletBalance,
            iconClass: 'fas fa-wallet',
            bgColor: 'bg-primary'
          },
          {
            title: 'Ongoing Projects',
            amount: data.activeProjectsCount,
            iconClass: 'fas fa-spinner',
            bgColor: 'bg-info'
          },
          {
            title: 'Donations Made',
            amount: data.totalDonations,
            iconClass: 'fas fa-donate',
            bgColor: 'bg-warning'
          },
          {
            title: 'Current Funding',
            amount: '₦0.00',
            iconClass: 'fas fa-check-circle',
            bgColor: 'bg-success'
          }
        ]
      case 'admin':
        return [
          {
            title: 'Number of NGOs',
            amount: data.ngoUsersCount,
            iconClass: 'fas fa-users',
            bgColor: 'bg-success'
          },
          {
            title: 'Pending Requests',
            amount: data.pendingRequests,
            iconClass: 'fas fa-clock',
            bgColor: 'bg-warning'
          },
          {
            title: 'Total Project Funding',
            amount: data.donationCount,
            iconClass: 'fas fa-donate',
            bgColor: 'bg-info'
          },
          {
            title: 'Number of Projects',
            amount: data.projectCount,
            iconClass: 'fas fa-tasks',
            bgColor: 'bg-primary'
          }
        ]
      default:
        return []
    }
  }

  const setupTableAttributes = (role: string) => {
    // Set dynamic headers and actions based on the role
    switch (role) {
      case 'NGO':
        setHeaders([
          'Title',
          'Description',
          'Amount',
          'Type',
          'Status',
          'Date-Time'
        ])
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ])
        break
      case 'donor':
      case 'corporate':
        setHeaders([
          'Title',
          'Description',
          'Amount',
          'Type',
          'Status',
          'Date-Time'
        ])
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ])
        break
      case 'admin':
        setHeaders([
          'Title',
          'Description',
          'Amount',
          'Type',
          'Status ',
          'Date-Time'
        ])
        setActions([
          {
            label: 'View',
            onClick: (row) => console.log('View details of', row)
          }
        ])
        break
      default:
        setHeaders([])
        setActions([])
    }
  }

  const handleEmptyStateClick = () => {}
  const fund = () => {
    if (authState.user.role === 'NGO') {
      navigate('/ngo/fund_wallet')
    } else {
      navigate('/donor/fund_wallet')
    }
  }
  const send = () => {
    if (authState.user.role === 'NGO') {
      navigate('/ngo/send_money')
    } else {
      navigate('/donor/send_money')
    }
  }

  return (
    <>
      {authState.user.role !== 'admin' && (
        <Container
          fluid
          style={{ display: 'flex', justifyContent: 'flex-end' }}
          className='text-end mb-3 pr-2'
        >
          <Button
            style={{
              backgroundColor: '#7B80DD',
              border: 'none',
              marginRight: '10px',
              padding: '10px 20px',
              borderRadius: '5px'
            }}
            onClick={() => fund()}
          >
            Fund Wallet
          </Button>
          {authState.user.role !== 'NGO' && (
            <Button
              style={{
                backgroundColor: 'white',
                color: '#7B80DD',
                border: '1px solid #7B80DD',
                padding: '10px 20px',
                borderRadius: '5px'
              }}
              onClick={() => send()}
            >
              Send Money
            </Button>
          )}
          {authState.user.role === 'NGO' && (
            <Button
              style={{
                backgroundColor: 'white',
                color: '#7B80DD',
                border: '1px solid #7B80DD',
                padding: '10px 20px',
                borderRadius: '5px',
                marginLeft: '10px'
              }}
              onClick={() => openModal()}
            >
              Withdraw
            </Button>
          )}
        </Container>
      )}

      <DashBox items={dashBoxItems} />
      <Tables
        tableName='Recent Transactions'
        headers={headers}
        data={tableData}
        isPagination={false}
        actions={actions}
        emptyStateContent='No Transactions found'
        emptyStateButtonLabel=''
        onEmptyStateButtonClick={handleEmptyStateClick}
        // filter={filter}
        currentPage={''}
        totalPages={''}
        onPageChange={''}
      />
      <Withdraw open={isModalOpen} handleClose={closeModal} />
    </>
  )
}

export default FundsM
