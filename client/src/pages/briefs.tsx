import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Col, Row } from 'reactstrap'
import Loading from '../components/home/loading'
import Tables from '../components/tables'
import useBackendService from '../services/backend_service'
import { capitalizeFirstLetter } from '../services/capitalize'
import { useContent } from '../services/useContext'

const Briefs = () => {
  const { authState, currentState } = useContent()
  const navigate = useNavigate()
  const [Tableheaders, setTableHeaders] = useState([])
  const [TableData, setTableData] = useState([])
  const [TableActions, setTableActions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  //filters
  const [filteredNgos, setFilteredNgos] = useState([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const role = authState.user?.role

  const { mutate: fetchUsers, isLoading } = useBackendService(
    '/allprojects',
    'GET',
    {
      onSuccess: (res: any) => {
        const filteredData =
          res.projects
            ?.filter((project: any) => project.id) // Remove users without an id
            .map((project: any) => ({
              id: project.id,
              Title: project.title, // Adjust field name if necessary
              Description: project.description, // Adjust field name if necessary
              Sponsor: project.donor?.name ?? '', // Avoid error and provide default empty value
              Start_Date: project.startDate,
              End_date: project.endDate,
              Category: project.category,
              Status: capitalizeFirstLetter(project.status)
            })) || []
        setupTableAttributes(role)
        setTableData(filteredData)
        setFilteredNgos(filteredData)
        setTotalPages(res.totalPages || 1)
      },
      onError: (error) => {
        toast.error('Failed to fetch NGOs.')
      }
    }
  )

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  useEffect(() => {
    let filters: any = {
      page: currentPage,
      category: selectedArea,
      projectType: 'present',
      status: 'brief',
      startDate: start,
      endDate: end
    }

    if (authState?.user?.role === 'NGO') {
      filters.organization_id = currentState?.user?.id
    } else {
      filters.donor_id = currentState?.user?.id
    }

    fetchUsers(filters)
  }, [currentPage, selectedArea, start, end])

  const setupTableAttributes = (role: string) => {
    switch (role) {
      case 'NGO':
        setTableHeaders([
          ' Title',
          'Description',
          'Sponsor',
          'Start_Date',
          'End_date',
          'Category',
          'Status'
        ])
        setTableActions([
          {
            label: 'View',
            onClick: (row) => handleView(row.id)
          }
        ])
        break
      case 'donor':
      case 'corporate':
        setTableHeaders([
          ' Title',
          'Description',
          'Sponsor',
          'Start_Date',
          'End_date',
          'Category',
          'Status'
        ])
        setTableActions([
          {
            label: 'View',
            onClick: (row) => handleView(row.id)
          },
          {
            label: 'Delete',
            onClick: (row) => console.log('View details of', row)
          }
        ])
        break

      default:
        setTableHeaders([])
        setTableActions([])
    }
  }

  const handleView = (id: number) => {
    if (authState?.user?.role === 'NGO') {
      navigate(`/ngo/project/${id}`)
    } else {
      navigate(`/donor/project/${id}`)
    }
  }

  const handleEmptyStateClick = () => {
    if (authState?.user?.role === 'NGO') {
      console.log('Unallowed action')
    } else {
      navigate('/donor/brief_initiate') // Redirect to admin briefs
    }
  }

  ///filters
  const { mutate: getAreas } = useBackendService('/areas', 'GET', {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[])
    },
    onError: () => {}
  })

  useEffect(() => {
    getAreas({})
  }, [])

  let timeoutId: NodeJS.Timeout
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase()
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    clearTimeout(timeoutId)

    timeoutId = setTimeout(async () => {
      try {
        fetchUsers({ page: 1, name: searchQuery, status: 'brief' })

        setIsSearchActive(true)
      } catch (error) {
        toast.error('Error fetching search results')
      }
    }, 1000)
  }
  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchActive(false)
    fetchUsers({ page: currentPage, status: 'brief' })
  }

  const handleAreaChange = (e) => {
    setSelectedArea(e)
  }

  const handleFilter = (filter) => {
    const filtered = TableData.filter((ngo) => {
      if (filter === 'active') return ngo.Status === 'Active'
      if (filter === 'brief') return ngo.Status === 'Brief'
      if (filter === 'completed') return ngo.Status === 'Completed'
      if (filter) return ngo.Area.toLowerCase() === filter.toLowerCase()
      return true
    })
    setFilteredNgos(filtered)
  }

  const filter = () => {
    if (authState.user.role === 'NGO') {
    } else {
      return (
        <Row className='mt-4 p-3'>
          <Col
            lg='12'
            md
            className='d-flex justify-content-between align-items-center'
          >
            {isSearchActive && <h4 className='mr-5'>Search Results</h4>}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  style={{
                    border: '1px solid #7b80dd',
                    borderRadius: '3px',
                    padding: '5px 30px 5px 10px',
                    outline: 'none',
                    width: '120px'
                  }}
                  onChange={handleSearch}
                />
                <FaSearch
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#7b80dd'
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type='date' // Changed from 'text' to 'date'
                  value={start} // Assuming `searchQuery` holds the selected date
                  style={{
                    border: '1px solid #7b80dd',
                    borderRadius: '3px',
                    padding: '5px 30px 5px 10px',
                    outline: 'none',
                    width: '120px'
                  }}
                  onChange={(e) => setStart(e.target.value)} // This function should handle date changes
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type='date' // Changed from 'text' to 'date'
                  value={end} // Assuming `searchQuery` holds the selected date
                  style={{
                    border: '1px solid #7b80dd',
                    borderRadius: '3px',
                    padding: '5px 30px 5px 10px',
                    outline: 'none',
                    width: '120px'
                  }}
                  onChange={(e) => setEnd(e.target.value)} // This function should handle date changes
                />
              </div>

              <select
                style={{
                  border: '1px solid #7b80dd',
                  borderRadius: '3px',
                  padding: '5px 30px 5px 10px',
                  outline: 'none',
                  appearance: 'none',
                  width: '120px'
                }}
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value)}
              >
                <option value=''>Select Area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>

              {isSearchActive && (
                <div style={{ display: 'flex' }}>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={handleClearSearch}
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
                </div>
              )}
            </div>
            <Button
              className='float-end ml-2'
              style={{
                backgroundColor: '#7B80DD',
                color: '#fff',
                borderRadius: '3px',
                border: 'none'
              }}
              onClick={() => navigate('/donor/brief_initiate')}
            >
              + Initiate a Project
            </Button>
          </Col>
        </Row>
      )
    }
  }
  let empty
  if (authState?.user?.role === 'NGO') {
    empty = ''
  } else {
    empty = 'Initiate Brief'
  }

  return (
    <>
      {isLoading ? (
        <Loading type='inline' />
      ) : (
        <Tables
          tableName='Briefs'
          headers={Tableheaders}
          data={filteredNgos}
          isPagination={true}
          actions={TableActions}
          emptyStateContent='No briefs available'
          emptyStateButtonLabel={empty}
          onEmptyStateButtonClick={handleEmptyStateClick}
          filter={filter}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}
export default Briefs
