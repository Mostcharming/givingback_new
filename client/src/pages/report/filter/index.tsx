import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import useBackendService from '../../../services/backend_service'
import ResultsModal from './result'

interface DataItem {
  State: string
  LocalGovt: string
  Community: string
  Donor: string
  Project: string
  NoOfProjects: string
  NGO: string
  Funding: string
  Beneficiaries: string
  Gender: string
  EthnicityRace: string
  Frequency: string
  Duration: string
}

// Define filter values type
interface FilterValues {
  amount?: string
  startDate?: string
  title?: string
  donor?: string
  user?: string
  status?: string
  thematicArea?: string[]
  projectName?: string
  registeredDate?: string
  cacNumber?: string
  website?: string
  state?: string[]
}

const data: DataItem[] = [
  {
    State: 'Abia',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Abia',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Abia',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Abia',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Adamawa',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Adamawa',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Adamawa',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Adamawa',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Akwa-Ibom',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Akwa-Ibom',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Akwa-Ibom',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Akwa-Ibom',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Anambra',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Anambra',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Anambra',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Anambra',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Bauchi',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Bauchi',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Bauchi',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Bauchi',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Bayelsa',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Bayelsa',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Bayelsa',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Bayelsa',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  },
  {
    State: 'Benue',
    LocalGovt: 'Aba South',
    Community: '6',
    Donor: '7',
    Project: 'Gender-Based Violence',
    NoOfProjects: '23',
    NGO: '18',
    Funding: 'N23,069,085',
    Beneficiaries: '1092',
    Gender: 'Women',
    EthnicityRace: 'Arochukwu',
    Frequency: '3878',
    Duration: '12'
  },
  {
    State: 'Benue',
    LocalGovt: 'Aba North',
    Community: '4',
    Donor: '5',
    Project: 'Child Mortality',
    NoOfProjects: '38',
    NGO: '24',
    Funding: 'N12,904,126',
    Beneficiaries: '3798',
    Gender: 'Women',
    EthnicityRace: 'Aro Oke-Igbo',
    Frequency: '12892',
    Duration: '12'
  },
  {
    State: 'Benue',
    LocalGovt: 'Isiala Ngwa North',
    Community: '8',
    Donor: '9',
    Project: 'Girl Child Labour',
    NoOfProjects: '12',
    NGO: '16',
    Funding: 'N64,049,005',
    Beneficiaries: '9127',
    Gender: 'Women',
    EthnicityRace: 'Ibini-Ukpai',
    Frequency: '23788',
    Duration: '12'
  },
  {
    State: 'Benue',
    LocalGovt: 'Isiala Ngwa South',
    Community: '2',
    Donor: '11',
    Project: 'Primary Education',
    NoOfProjects: '17',
    NGO: '21',
    Funding: 'N39,069,085',
    Beneficiaries: '576',
    Gender: 'Women',
    EthnicityRace: 'Ututu',
    Frequency: '17627',
    Duration: '12'
  }
]
const nigerianStates = [
  { value: 'Abia', label: 'Abia' },
  { value: 'Abuja', label: 'Abuja' },
  { value: 'Adamawa', label: 'Adamawa' },
  { value: 'Akwa Ibom', label: 'Akwa Ibom' },
  { value: 'Anambra', label: 'Anambra' },
  { value: 'Bauchi', label: 'Bauchi' },
  { value: 'Bayelsa', label: 'Bayelsa' },
  { value: 'Benue', label: 'Benue' },
  { value: 'Borno', label: 'Borno' },
  { value: 'Cross River', label: 'Cross River' },
  { value: 'Delta', label: 'Delta' },
  { value: 'Ebonyi', label: 'Ebonyi' },
  { value: 'Edo', label: 'Edo' },
  { value: 'Ekiti', label: 'Ekiti' },
  { value: 'Enugu', label: 'Enugu' },
  { value: 'Gombe', label: 'Gombe' },
  { value: 'Imo', label: 'Imo' },
  { value: 'Jigawa', label: 'Jigawa' },
  { value: 'Kaduna', label: 'Kaduna' },
  { value: 'Kano', label: 'Kano' },
  { value: 'Kogi', label: 'Kogi' },
  { value: 'Kwara', label: 'Kwara' },
  { value: 'Lagos', label: 'Lagos' },
  { value: 'Nasarawa', label: 'Nasarawa' },
  { value: 'Niger', label: 'Niger' },
  { value: 'Ogun', label: 'Ogun' },
  { value: 'Ondo', label: 'Ondo' },
  { value: 'Osun', label: 'Osun' },
  { value: 'Oyo', label: 'Oyo' },
  { value: 'Plateau', label: 'Plateau' },
  { value: 'Rivers', label: 'Rivers' },
  { value: 'Sokoto', label: 'Sokoto' },
  { value: 'Taraba', label: 'Taraba' },
  { value: 'Yobe', label: 'Yobe' },
  { value: 'Zamfara', label: 'Zamfara' }
]

function FilterModal({ show, handleClose }) {
  const [mainCriteria, setMainCriteria] = useState('')
  const [selectedSubCriteria, setSelectedSubCriteria] = useState([])
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [filterValues, setFilterValues] = useState<FilterValues>({})
  const [thematicAreas, setThematicAreas] = useState([])

  const { mutate: getAreas } = useBackendService('/areas', 'GET', {
    onSuccess: (res2: any) => {
      setThematicAreas(
        res2.data.map((area) => ({ value: area.id, label: area.name }))
      )
    },
    onError: () => {}
  })

  const subCriteriaOptions = {
    Project: [
      { value: 'title', label: 'Title' },
      { value: 'amount', label: 'Amount' },
      { value: 'startDate', label: 'Start Date' },
      { value: 'donor', label: 'Donor' },
      { value: 'user', label: 'User' },
      { value: 'status', label: 'Status' },
      { value: 'thematicArea', label: 'Thematic Area' },
      { value: 'state', label: 'State' }
    ],
    Users: [
      { value: 'projectName', label: 'Project Name' },
      { value: 'registeredDate', label: 'Registered Date' },
      { value: 'cacNumber', label: 'CAC Number' },
      { value: 'website', label: 'Website' }
    ],
    Donor: [
      { value: 'projectName', label: 'Project Name' },
      { value: 'registeredDate', label: 'Registered Date' }
    ]
  }

  useEffect(() => {
    const fetchThematicAreas = async () => {
      try {
        getAreas({})
      } catch (error) {
        console.error('Error fetching thematic areas:', error)
      }
    }

    if (mainCriteria === 'Project') {
      fetchThematicAreas() // Only fetch when "Project" is selected as main criteria
    }
  }, [mainCriteria])

  const handleMainCriteriaChange = (selectedOption) => {
    setMainCriteria(selectedOption ? selectedOption.value : '')
    setSelectedSubCriteria([])
    setFilterValues({})
  }

  const handleSubCriteriaChange = (selectedOptions) => {
    setSelectedSubCriteria(selectedOptions || [])
  }

  const handleInputChange = (e, criteria) => {
    setFilterValues({ ...filterValues, [criteria]: e.target.value })
  }

  const handleSelectChange = (selectedOptions, criteria) => {
    setFilterValues({
      ...filterValues,
      [criteria]: selectedOptions.map((option) => option.value)
    })
  }

  const renderSubCriteriaFields = () => {
    return selectedSubCriteria.map((criteria) => {
      switch (criteria.value) {
        case 'amount':
          return (
            <Form.Group controlId='amount' key='amount'>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter amount'
                onChange={(e) => handleInputChange(e, 'amount')}
              />
            </Form.Group>
          )
        case 'title':
          return (
            <Form.Group controlId='title' key='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter title'
                onChange={(e) => handleInputChange(e, 'title')}
              />
            </Form.Group>
          )
        case 'startDate':
          return (
            <Form.Group controlId='startDate' key='startDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                onChange={(e) => handleInputChange(e, 'startDate')}
              />
            </Form.Group>
          )
        case 'donor':
          return (
            <Form.Group controlId='donor' key='donor'>
              <Form.Label>Donor</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter donor name'
                onChange={(e) => handleInputChange(e, 'donor')}
              />
            </Form.Group>
          )
        case 'user':
          return (
            <Form.Group controlId='user' key='user'>
              <Form.Label>User</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter user name'
                onChange={(e) => handleInputChange(e, 'user')}
              />
            </Form.Group>
          )
        case 'status':
          return (
            <Form.Group controlId='status' key='status'>
              <Form.Label>Status</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter status'
                onChange={(e) => handleInputChange(e, 'status')}
              />
            </Form.Group>
          )
        case 'thematicArea':
          return (
            <Form.Group controlId='thematicArea' key='thematicArea'>
              <Form.Label>Thematic Area</Form.Label>
              <Select
                isMulti
                options={thematicAreas}
                onChange={(selected) =>
                  handleSelectChange(selected, 'thematicArea')
                }
                placeholder='Select thematic areas'
              />
            </Form.Group>
          )
        case 'state':
          return (
            <Form.Group controlId='state' key='state'>
              <Form.Label>State</Form.Label>
              <Select
                isMulti
                options={nigerianStates}
                onChange={(selected) => handleSelectChange(selected, 'state')}
                placeholder='Select states'
              />
            </Form.Group>
          )
        case 'projectName':
          return (
            <Form.Group controlId='projectName' key='projectName'>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter project name'
                onChange={(e) => handleInputChange(e, 'projectName')}
              />
            </Form.Group>
          )
        case 'registeredDate':
          return (
            <Form.Group controlId='registeredDate' key='registeredDate'>
              <Form.Label>Registered Date</Form.Label>
              <Form.Control
                type='date'
                onChange={(e) => handleInputChange(e, 'registeredDate')}
              />
            </Form.Group>
          )
        case 'cacNumber':
          return (
            <Form.Group controlId='cacNumber' key='cacNumber'>
              <Form.Label>CAC Number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter CAC number'
                onChange={(e) => handleInputChange(e, 'cacNumber')}
              />
            </Form.Group>
          )
        case 'website':
          return (
            <Form.Group controlId='website' key='website'>
              <Form.Label>Website</Form.Label>
              <Form.Control
                type='url'
                placeholder='Enter website URL'
                onChange={(e) => handleInputChange(e, 'website')}
              />
            </Form.Group>
          )
        default:
          return null
      }
    })
  }

  const applyFilters = () => {
    let filtered = data

    if (mainCriteria === 'Project') {
      filtered = filtered.filter((item) => {
        return (
          (!filterValues.amount ||
            item.Funding.includes(filterValues.amount)) &&
          (!filterValues.startDate ||
            item.Duration === filterValues.startDate) &&
          (!filterValues.donor ||
            item.Donor.toLowerCase().includes(
              filterValues.donor.toLowerCase()
            )) &&
          (!filterValues.title ||
            item.Project.toLowerCase().includes(
              filterValues.title.toLowerCase()
            )) &&
          (!filterValues.user ||
            item.NGO.toLowerCase().includes(filterValues.user.toLowerCase())) &&
          (!filterValues.status ||
            item.Project.toLowerCase().includes(
              filterValues.status.toLowerCase()
            )) &&
          (!filterValues.thematicArea ||
            filterValues.thematicArea.includes(item.EthnicityRace)) && // Assuming EthnicityRace matches thematic areas
          (!filterValues.state || filterValues.state.includes(item.State))
        ) // State filter applied here
      })
    } else if (mainCriteria === 'Users') {
      filtered = filtered.filter((item) => {
        return (
          (!filterValues.projectName ||
            item.Project.toLowerCase().includes(
              filterValues.projectName.toLowerCase()
            )) &&
          (!filterValues.registeredDate ||
            item.Duration === filterValues.registeredDate) &&
          (!filterValues.cacNumber ||
            item.LocalGovt.toLowerCase().includes(
              filterValues.cacNumber.toLowerCase()
            )) &&
          (!filterValues.website ||
            item.Community.toLowerCase().includes(
              filterValues.website.toLowerCase()
            ))
        )
      })
    } else if (mainCriteria === 'Donor') {
      filtered = filtered.filter((item) => {
        return (
          (!filterValues.projectName ||
            item.Project.toLowerCase().includes(
              filterValues.projectName.toLowerCase()
            )) &&
          (!filterValues.registeredDate ||
            item.Duration === filterValues.registeredDate)
        )
      })
    }

    setFilteredData(filtered)
    setShowResultsModal(true)
  }

  const handleCloseResultsModal = () => {
    setShowResultsModal(false)
    handleClose()
  }

  return (
    <>
      {show && !showResultsModal && (
        <Modal
          show={show}
          onHide={handleClose}
          size='lg'
          className='custom-modal'
          backdropClassName='custom-backdrop'
        >
          <Modal.Header closeButton>
            <Modal.Title className='modal-title'>Filter Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='mainCriteria'>
                <Form.Label>Main Criteria</Form.Label>
                <Select
                  placeholder='Please select criteria'
                  onChange={handleMainCriteriaChange}
                  options={[
                    { value: 'Project', label: 'Project' },
                    { value: 'Users', label: 'Users' },
                    { value: 'Donor', label: 'Donor' }
                  ]}
                  value={
                    mainCriteria
                      ? { value: mainCriteria, label: mainCriteria }
                      : null
                  }
                />
              </Form.Group>

              {mainCriteria && (
                <Form.Group controlId='subCriteria'>
                  <Form.Label>Sub Criteria</Form.Label>
                  <Select
                    placeholder='Select sub criteria'
                    onChange={handleSubCriteriaChange}
                    options={subCriteriaOptions[mainCriteria]}
                    isMulti
                    value={selectedSubCriteria}
                  />
                </Form.Group>
              )}

              {renderSubCriteriaFields()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button style={{ background: '#6c72d9' }} onClick={applyFilters}>
              Apply Filter
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <ResultsModal
        show={showResultsModal}
        handleClose={handleCloseResultsModal}
        data={filteredData}
      />
    </>
  )
}

export default FilterModal
