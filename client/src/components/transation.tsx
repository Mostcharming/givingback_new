import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useBackendService from '../services/backend_service'
import { capitalizeFirstLetter } from '../services/capitalize'
import { formatDate } from './formatTime'
import Tables from './tables'

// import Detail from '../../../../dashboard/past-projects/detail'

const NGOTransaction = ({ id }: { id: number }) => {
  const [Tableheaders, setTableHeaders] = useState([])
  const [TableData, setTableData] = useState([])
  const [TableActions, setTableActions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const { mutate: getTableData, isLoading } = useBackendService(
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

        setTableData(filteredData)
        setTotalPages(res.totalPages || 1)
        setTableHeaders(['Project', 'Description', 'Type', 'Amount', 'Date'])
        setTableActions([
          // {
          //   label: 'View',
          //   onClick: (row) => openNgoPage(row.id)
          // },
          // { label: 'Update', onClick: (row) => console.log(row) }
        ])
      },
      onError: () => {
        toast.error('Error getting transations')
      }
    }
  )
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  useEffect(() => {
    getTableData({ page: currentPage, limit: 10, ngo_id: id })
  }, [currentPage])

  const handleEmptyStateClick = () => {
    navigate('/admin/ngo_directory') // Redirect to donor briefs
  }

  return (
    <Tables
      tableName='NGO Transactions'
      headers={Tableheaders}
      data={TableData}
      isPagination={true}
      actions={TableActions}
      emptyStateContent='No Transactions available'
      emptyStateButtonLabel='Back'
      onEmptyStateButtonClick={handleEmptyStateClick}
      // filter={}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}

export default NGOTransaction
