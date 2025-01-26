import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import useBackendService from '../../../services/backend_service'
import { Banks } from '../../../services/banks'
import { useContent } from '../../../services/useContext'
import Util, { States } from '../../../services/utils'

interface CorporateDetailsFormProps {
  previewUrl: string | null
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedState: string | null
  handleStateChange: (selectedOption: { value: string; label: string }) => void
  lgas: string[]
  selectedLGA: string | null
  handleLGAChange: (selectedOption: { value: string; label: string }) => void
  fileInputRef
  handleImageClick
  areas
  formData
  setFormData
  onNext
  handlefileUpload
}
interface PersonalDetailsFormProps {
  previewUrl: string | null
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef
  handleImageClick
  formData
  setFormData
  onSubmit
  isLoading
}

const SignUp = ({ ngo }) => {
  const { authState, currentState } = useContent()

  useEffect(() => {
    if (authState?.isAuthenticated && currentState.user?.id) {
      navigate('/dashboard')
    }
  }, [])

  const auth = authState
  const [activeTab, setActiveTab] = useState(ngo ? 'organization' : 'corporate')
  const navigate = useNavigate()

  const [areas, setAreas] = useState([])
  const [corporateFormData, setCorporateFormData] = useState({})
  const [personalFormData, setPersonalFormData] = useState({})

  const [orgdetilsFormData, setOrgdetailsFormData] = useState({})
  const [kycFormData, setKycdetailsFormData] = useState({})

  const handleCorporateNext = () => {
    if (!ngo) {
      if (
        validateCorporateForm(
          corporateFormData,
          image,
          selectedFile,
          selectedState,
          selectedLGA
        )
      ) {
        setActiveTab('personal')
      } else {
        toast.error('Please fill out all fields in the Corporate Details form.')
      }
    } else {
      if (
        validateCorporateForm(
          orgdetilsFormData,
          image,
          selectedFile,
          selectedState,
          selectedLGA
        )
      ) {
        setActiveTab('kyc')
      } else {
        toast.error(
          'Please fill out all fields in the Organization Details form.'
        )
      }
    }
  }
  const handlePersonalSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!ngo) {
      if (validatePersonalForm(personalFormData, image)) {
        submitFinalForm()
      } else {
        toast.error('Please fill out all fields in the Personal Details form.')
      }
    } else {
      if (validatePersonalForm(kycFormData, image)) {
        submitFinalngoForm()
      } else {
        toast.error('Please fill out all fields in the KYC Details form.')
      }
    }
  }

  const { mutate: submitDonorForm, isLoading: donorLoad } = useBackendService(
    '/donor/onboard',
    'POST',
    {
      onSuccess: () => {
        toast.success('Form submitted successfully!')
        navigate('/dashboard')
      },
      onError: () => {
        toast.error('Form submission failed')
      }
    }
  )

  const submitFinalForm = async () => {
    if (
      !validateCorporateForm(
        corporateFormData,
        image,
        selectedFile,
        selectedState,
        selectedLGA
      )
    ) {
      toast.error('Please fill out all fields in the Corporate Details form.')
      return
    }

    if (!validatePersonalForm(personalFormData, image)) {
      toast.error('Please fill out all fields in the Personal Details form.')
      return
    }

    if (!image) {
      toast.error('Please upload a profile image.')
      return
    }

    if (!selectedFile) {
      toast.error('Please upload the CAC document.')
      return
    }

    if (!selectedState) {
      toast.error('Please select a state.')
      return
    }

    if (!selectedLGA) {
      toast.error('Please select an LGA.')
      return
    }

    const finalFormData = new FormData()

    Object.keys(personalFormData).forEach((key) => {
      finalFormData.append(key, personalFormData[key])
    })

    Object.keys(corporateFormData).forEach((key) => {
      finalFormData.append(key, corporateFormData[key])
    })

    finalFormData.append('userimg', image)
    finalFormData.append('cacidimage', selectedFile)
    finalFormData.append('state', selectedState)
    finalFormData.append('city_lga', selectedLGA)

    submitDonorForm(finalFormData)
  }
  const submitFinalngoForm = async () => {
    if (
      !validateCorporateForm(
        orgdetilsFormData,
        image,
        selectedFile,
        selectedState,
        selectedLGA
      )
    ) {
      toast.error(
        'Please fill out all fields in the Organization Details form.'
      )
      return
    }

    if (!validatePersonalForm(kycFormData, image)) {
      toast.error('Please fill out all fields in the KYC Details form.')
      return
    }

    if (!image) {
      toast.error('Please upload a profile image.')
      return
    }

    if (!selectedFile) {
      toast.error('Please upload the CAC document.')
      return
    }

    if (!selectedState) {
      toast.error('Please select a state.')
      return
    }

    if (!selectedLGA) {
      toast.error('Please select an LGA.')
      return
    }

    const finalFormData = new FormData()

    Object.keys(kycFormData).forEach((key) => {
      finalFormData.append(key, kycFormData[key])
    })

    Object.keys(orgdetilsFormData).forEach((key) => {
      finalFormData.append(key, orgdetilsFormData[key])
    })

    finalFormData.append('userimg', image)
    finalFormData.append('cacidimage', selectedFile)
    finalFormData.append('state', selectedState)
    finalFormData.append('city_lga', selectedLGA)

    submitngoForm(finalFormData)
  }

  const handlePersonalSubmitp = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validatePersonalForm(personalFormData, image)) {
      submitFinalFormp()
    } else {
      toast.error('Please fill out all fields in the Personal Details form.')
    }
  }

  const { mutate: submitDonorPForm, isLoading: donorPload } = useBackendService(
    '/donor/onboardp',
    'POST',
    {
      onSuccess: () => {
        toast.success('Form submitted successfully!')
        navigate('/dashboard')
      },
      onError: () => {
        toast.error('Form submission failed')
      }
    }
  )
  const { mutate: submitngoForm, isLoading } = useBackendService(
    '/ngo/onboard',
    'POST',
    {
      onSuccess: () => {
        toast.success('Form submitted successfully!')
        navigate('/dashboard')
      },
      onError: () => {
        toast.error('Form submission failed')
      }
    }
  )

  const submitFinalFormp = async () => {
    const finalFormData = new FormData()

    Object.keys(personalFormData).forEach((key) => {
      finalFormData.append(key, personalFormData[key])
    })

    finalFormData.append('userimg', image)

    submitDonorPForm(finalFormData)
  }

  const validateCorporateForm = (
    formData: any,
    image: File | null,
    selectedFile: File | null,
    selectedState: string | null,
    selectedLGA: string | null
  ) => {
    const formFieldsValid = Object.values(formData).every(
      (value) => value !== null && value !== ''
    )
    const imageValid = image !== null
    const fileValid = selectedFile !== null
    const stateValid = selectedState !== null && selectedState !== ''
    const lgaValid = selectedLGA !== null && selectedLGA !== ''
    return formFieldsValid && imageValid && fileValid && stateValid && lgaValid
  }

  const validatePersonalForm = (formData: any, image: File | null) => {
    const formFieldsValid = Object.values(formData).every(
      (value) => value !== null && value !== ''
    )
    const imageValid = image !== null
    return formFieldsValid && imageValid
  }

  const { mutate: getAreas } = useBackendService('/areas', 'GET', {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[])
    },
    onError: () => {}
  })

  useEffect(() => {
    getAreas({})
  }, [])

  //corporate
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }
  const handlefileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setSelectedFile(file)
    }
  }
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null)
  const [lgas, setLgas] = useState<string[]>([])

  const handleStateChange = (selectedOption: {
    value: string
    label: string
  }) => {
    setSelectedState(selectedOption.value)
    setLgas(States.get(selectedOption.value) || [])
    setSelectedLGA(null)
  }
  const handleLGAChange = (selectedOption: {
    value: string
    label: string
  }) => {
    setSelectedLGA(selectedOption.value)
  }

  const renderForm = () => {
    if (auth.user.role === 'corporate') {
      return activeTab === 'corporate' ? (
        <CorporateDetailsForm
          previewUrl={previewUrl}
          handleImageUpload={handleImageUpload}
          handleStateChange={handleStateChange}
          selectedState={selectedState}
          lgas={lgas}
          handleLGAChange={handleLGAChange}
          selectedLGA={selectedLGA}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          areas={areas}
          formData={corporateFormData}
          setFormData={setCorporateFormData}
          onNext={handleCorporateNext}
          handlefileUpload={handlefileUpload}
        />
      ) : (
        <PersonalDetailsForm
          previewUrl={previewUrl}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          formData={personalFormData}
          setFormData={setPersonalFormData}
          onSubmit={handlePersonalSubmit}
          isLoading={donorLoad}
        />
      )
    } else if (auth.user.role === 'donor') {
      return (
        <PersonalDetailsDonorForm
          previewUrl={previewUrl}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          formData={personalFormData}
          setFormData={setPersonalFormData}
          onSubmit={handlePersonalSubmitp}
          isLoading={donorPload}
        />
      )
    } else if (auth.user.role === 'NGO') {
      return activeTab === 'organization' ? (
        <Org
          previewUrl={previewUrl}
          handleImageUpload={handleImageUpload}
          handleStateChange={handleStateChange}
          selectedState={selectedState}
          lgas={lgas}
          handleLGAChange={handleLGAChange}
          selectedLGA={selectedLGA}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          areas={areas}
          formData={orgdetilsFormData}
          setFormData={setOrgdetailsFormData}
          onNext={handleCorporateNext}
          handlefileUpload={handlefileUpload}
        />
      ) : (
        <KYC
          previewUrl={previewUrl}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          formData={kycFormData}
          setFormData={setKycdetailsFormData}
          onSubmit={handlePersonalSubmit}
          isLoading={isLoading}
        />
      )
    }
    return null
  }

  const renderTabs = () => {
    if (auth.user.role === 'corporate') {
      return (
        <div className='tabs mt-3'>
          <Tab
            label='Corporate Details'
            active={activeTab === 'corporate'}
            onClick={() => setActiveTab('corporate')}
          />
          <Tab
            label='Personal Details'
            active={activeTab === 'personal'}
            onClick={() => setActiveTab('personal')}
          />
        </div>
      )
    } else if (auth.user.role === 'donor') {
      return (
        <div className='tabs mt-3'>
          <Tab label='Personal Details' active />
        </div>
      )
    } else if (auth.user.role === 'NGO') {
      return (
        <div className='tabs mt-3'>
          <Tab
            label='Organization Details'
            active={activeTab === 'organization'}
            onClick={() => setActiveTab('organization')}
          />
          <Tab
            label='KYC Details'
            active={activeTab === 'kyc'}
            onClick={() => setActiveTab('kyc')}
          />
        </div>
      )
    }
  }

  return (
    <div>
      <Container>
        <h1
          style={{
            fontFamily: 'Nunito Sans',
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: '44px',
            letterSpacing: '-0.02em',
            textAlign: 'left'
          }}
        >
          Hello, welcome to GivingBack
        </h1>
        <div
          style={{
            background: '#7B80DD',
            boxShadow: '1px 4px 11px 0px #CEBDE4',
            height: '55px',
            marginTop: '20px',
            borderRadius: '5px 0px 0px 0px',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.9,
            paddingLeft: '20px',
            color: '#fff',
            fontFamily: 'Nunito Sans',
            fontSize: '18px',
            fontWeight: 400
          }}
        >
          {ngo ? 'NGO registration' : 'Donor registration'}
        </div>
        {renderTabs()}
        <div className='form-container mt-4'>{renderForm()}</div>
      </Container>
    </div>
  )
}

const formBoxStyle = {
  border: '1px solid #7B80DD',
  boxShadow: '1px 1px 9px 0px #CEBDE4',
  padding: '20px',
  borderRadius: '5px',
  background: '#fff'
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
  padding: '10px 20px',
  cursor: 'pointer',
  borderBottom: isActive ? '2px solid purple' : '2px solid transparent',
  fontWeight: isActive ? 600 : 400
})

const CorporateDetailsForm: React.FC<CorporateDetailsFormProps> = ({
  previewUrl,
  handleImageUpload,
  handleStateChange,
  selectedState,
  lgas,
  handleLGAChange,
  selectedLGA,
  fileInputRef,
  handleImageClick,
  areas,
  formData,
  setFormData,
  onNext,
  handlefileUpload
}) => {
  const [registrationNumberError, setRegistrationNumberError] =
    useState<string>('')

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target

    if (name === 'companyRegistration') {
      e.preventDefault()
      try {
        setRegistrationNumberError('')

        // await Util.checkIfCompanyRegistrationNumberIsValid(value)
        setFormData({ ...formData, [name]: value })
      } catch (err: any) {
        setRegistrationNumberError(err.response.data.message)
        setFormData({ ...formData, [name]: '' })
        toast.error('Invalid CAC. validation not successsful')
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent page refresh
    onNext() // Trigger the onNext function
  }

  return (
    <div className='mt-5 mx-box' id='form' style={formBoxStyle}>
      <Row>
        <Col lg='4' className='d-flex justify-content-center align-items-start'>
          <div
            onClick={handleImageClick}
            style={{
              textAlign: 'center',
              border: previewUrl ? 'none' : '1px solid #7B80DD',
              boxShadow: previewUrl ? 'none' : '1px 1px 9px 0px #CEBDE4',
              borderRadius: '5px',
              padding: previewUrl ? '0' : '50px',
              cursor: 'pointer'
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded'
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div>
                <svg
                  width='71'
                  height='70'
                  viewBox='0 0 71 70'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M61.8149 32.3331V7.99577C61.8149 3.58693 58.5905 0 54.6273 0H7.92007C3.95683 0 0.732422 3.58693 0.732422 7.99577V50.4693C0.732422 54.8781 3.95683 58.4651 7.92007 58.4651H35.6985C38.706 65.0596 44.8488 69.6 51.9388 69.6C61.9831 69.6 70.1548 60.5096 70.1548 49.336C70.1548 42.2128 66.8262 35.9478 61.8149 32.3331ZM7.92007 54.8443C5.7513 54.8443 3.9872 52.8819 3.9872 50.4693V7.99577C3.9872 5.58316 5.7513 3.62073 7.92007 3.62073H54.6273C56.796 3.62073 58.5601 5.58316 58.5601 7.99577V30.4781C56.5042 29.5813 54.2768 29.072 51.9388 29.072C50.8658 29.072 49.82 29.1963 48.7969 29.3955L43.4916 24.598C43.484 24.592 43.4764 24.5883 43.4688 24.5811C43.4232 24.5413 43.3744 24.5099 43.3256 24.4761C43.2811 24.4447 43.2388 24.4109 43.1921 24.3856C43.1574 24.3663 43.1205 24.3542 43.0836 24.3373C43.0207 24.3083 42.9589 24.2782 42.8938 24.2577C42.8699 24.2504 42.8439 24.2492 42.8189 24.242C42.743 24.2227 42.6649 24.2045 42.5878 24.1985C42.5575 24.1961 42.5249 24.1997 42.4945 24.1985C42.4229 24.1973 42.3502 24.1949 42.2786 24.2045C42.2396 24.2094 42.2016 24.2227 42.1625 24.2299C42.0974 24.2432 42.0334 24.2552 41.9705 24.2782C41.9347 24.2914 41.9 24.3108 41.8631 24.3277C41.798 24.3554 41.7351 24.3844 41.6732 24.4218C41.6667 24.4266 41.6591 24.4278 41.6526 24.4327L34.2838 29.1432L25.5241 20.0636C25.5154 20.054 25.5024 20.0516 25.4937 20.0431C25.3462 19.8959 25.1813 19.7861 25.0044 19.7088C24.9827 19.6992 24.9621 19.6895 24.9404 19.6811C24.7636 19.6135 24.5813 19.5821 24.3958 19.5845C24.3719 19.5845 24.348 19.5845 24.3242 19.5857C24.143 19.5966 23.964 19.6436 23.7926 19.7233C23.7676 19.7342 23.7437 19.745 23.7188 19.7583C23.5929 19.8247 23.4714 19.9043 23.3597 20.0093L6.77221 35.7004C6.08762 36.3473 6.00408 37.4902 6.58669 38.2518C6.90783 38.673 7.36675 38.889 7.82676 38.889C8.19998 38.889 8.57428 38.7478 8.88023 38.4581L24.3676 23.8099L37.3433 37.2621C35.0801 40.639 33.7218 44.8101 33.7218 49.336C33.7218 51.2477 33.9768 53.0895 34.4238 54.8443H7.92007ZM39.5121 34.561L36.777 31.726L42.3068 28.1922L44.9855 30.6132C42.9448 31.5558 41.1015 32.9064 39.5121 34.561ZM51.9388 65.9793C43.689 65.9793 36.9777 58.5121 36.9777 49.336C36.9777 40.1599 43.6901 32.6927 51.9388 32.6927C60.1875 32.6927 66.9 40.1599 66.9 49.336C66.9 58.5121 60.1886 65.9793 51.9388 65.9793Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M13.0145 20.3998C16.8423 20.3998 19.9567 16.9005 19.9567 12.5998C19.9567 8.29908 16.8423 4.7998 13.0145 4.7998C9.18672 4.7998 6.07227 8.29908 6.07227 12.5998C6.07227 16.9005 9.18672 20.3998 13.0145 20.3998ZM13.0145 8.49759C15.0272 8.49759 16.6645 10.3372 16.6645 12.5986C16.6645 14.8599 15.0272 16.6996 13.0145 16.6996C11.0018 16.6996 9.3645 14.8599 9.3645 12.5986C9.3645 10.3372 11.0018 8.49759 13.0145 8.49759Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M53.0971 38.838C53.0902 38.8319 53.0823 38.8281 53.0743 38.822C53.0505 38.7985 53.0232 38.78 52.9982 38.759C52.9584 38.7282 52.9164 38.6986 52.8744 38.6714C52.8471 38.6529 52.821 38.6332 52.7926 38.6159C52.7676 38.6011 52.7392 38.59 52.7142 38.5764C52.6699 38.5542 52.6255 38.5369 52.5801 38.5184C52.5483 38.5048 52.5165 38.49 52.4835 38.4789C52.4574 38.4702 52.429 38.4653 52.4029 38.4579C52.3574 38.4456 52.3108 38.4369 52.2642 38.4295C52.2302 38.4234 52.1961 38.4147 52.162 38.411C52.1313 38.4073 52.0984 38.4085 52.0677 38.4073C52.0438 38.4061 52.0223 38.3999 51.9984 38.3999C51.9745 38.3999 51.9529 38.4061 51.9291 38.4073C51.8984 38.4085 51.8655 38.4073 51.8348 38.411C51.8007 38.4147 51.7666 38.4234 51.7325 38.4295C51.6859 38.4382 51.6394 38.4468 51.5939 38.4579C51.5678 38.4653 51.5394 38.4702 51.5132 38.4789C51.4803 38.49 51.4485 38.5048 51.4167 38.5184C51.3712 38.5369 51.3269 38.5542 51.2826 38.5764C51.2576 38.59 51.2303 38.6023 51.2042 38.6159C51.1769 38.6332 51.1497 38.6529 51.1213 38.6714C51.0792 38.6986 51.0383 38.7282 50.9997 38.759C50.9736 38.78 50.9463 38.7985 50.9224 38.822C50.9145 38.8281 50.9065 38.8319 50.8997 38.838L44.0589 45.1136C43.3397 45.7727 43.2488 46.9402 43.8567 47.7214C44.193 48.1558 44.6747 48.378 45.1587 48.378C45.5473 48.378 45.9381 48.2348 46.2574 47.9411L50.2942 44.2374V58.1487C50.2942 59.1706 51.0577 59.9999 51.9984 59.9999C52.9391 59.9999 53.7026 59.1706 53.7026 58.1487V44.2386L57.7394 47.9423C58.0587 48.236 58.4495 48.3792 58.8381 48.3792C59.3232 48.3792 59.8049 48.1558 60.1401 47.7226C60.7479 46.9414 60.6571 45.7739 59.9379 45.1149L53.0971 38.838Z'
                    fill='#D3CECE'
                  />
                </svg>
                <p>Upload Logo</p>
              </div>
            )}

            <Form.Control
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </Col>
        <Col lg='8'>
          <Form.Group className='mb-4' controlId='name'>
            <Form.Label>Name of Individual/Organization</Form.Label>
            <Form.Control
              type='text'
              name='name'
              onChange={handleInputChange}
              required
              placeholder='Enter Name of Individual/Organization'
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='phoneNumber'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='text'
                  name='phoneNumber'
                  onChange={handleInputChange}
                  required
                  placeholder='Enter Phone Number'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='industry'>
                <Form.Label>Business/Industry</Form.Label>
                <Form.Control
                  type='text'
                  required
                  name='industry'
                  onChange={handleInputChange}
                  placeholder='Enter Business/Industry'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='orgemailAddress'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  required
                  name='orgemailAddress'
                  onChange={handleInputChange}
                  placeholder='Enter Email Address'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='interest_area'>
                <Form.Label>Area of Interest</Form.Label>
                <Select
                  options={areas.map((category) => ({
                    value: category.name,
                    label: category.name
                  }))}
                  placeholder='Select Area of Interest'
                  value={
                    formData.interest_area
                      ? formData.interest_area.split(',').map((value) => ({
                          value,
                          label: value
                        }))
                      : []
                  }
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map(
                      (option) => option.value
                    )
                    setFormData({
                      ...formData,
                      interest_area: selectedValues.join(',')
                    })
                  }}
                  isMulti
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='state'>
                <Form.Label>State</Form.Label>
                <Select
                  options={Array.from(States.keys()).map((state) => ({
                    value: state as string,
                    label: state as string
                  }))}
                  onChange={handleStateChange}
                  placeholder='Select State'
                  value={
                    selectedState
                      ? { value: selectedState, label: selectedState }
                      : null
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='lga'>
                <Form.Label>City/LGA</Form.Label>
                <Select
                  options={lgas.map((lga) => ({
                    value: lga,
                    label: lga
                  }))}
                  onChange={handleLGAChange}
                  placeholder='Select LGA'
                  value={
                    selectedLGA
                      ? { value: selectedLGA, label: selectedLGA }
                      : null
                  }
                  isDisabled={!selectedState}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='fileUploadCAC'>
                <Form.Label>Company Certificate of Registration</Form.Label>
                <Form.Control onChange={handlefileUpload} type='file' />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='companyRegistration'>
                <Form.Label>Company Registration No</Form.Label>
                <Form.Control
                  type='text'
                  required
                  name='companyRegistration'
                  onChange={handleInputChange}
                  placeholder='Enter Company Registration No'
                />
                {registrationNumberError && (
                  <Form.Text className='text-danger'>
                    {registrationNumberError}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className='mb-4' controlId='address'>
            <Form.Label>Address of Organization</Form.Label>
            <Form.Control
              as='textarea'
              name='address'
              onChange={handleInputChange}
              rows={2}
              placeholder='Enter Address of Organization'
            />
          </Form.Group>

          <Form.Group className='mb-4' controlId='about'>
            <Form.Label>About you/your Organization</Form.Label>
            <Form.Control
              as='textarea'
              name='about'
              onChange={handleInputChange}
              rows={2}
              placeholder='Tell us about your organization'
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='clearance'>
                <Form.Label>Anti-Money Laundry Clearance</Form.Label>
                <Select
                  options={[
                    { value: 'ISO', label: 'ISO' },
                    { value: 'SON', label: 'SON' }
                  ]}
                  placeholder='Select Clearance'
                  value={
                    formData.clearance
                      ? { value: formData.clearance, label: formData.clearance }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      clearance: selectedOption?.value || ''
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='certificateId'>
                <Form.Label>Enter Particular/Certificate ID</Form.Label>
                <Form.Control
                  name='certificateId'
                  onChange={handleInputChange}
                  type='text'
                  placeholder='Enter Certificate ID'
                />
              </Form.Group>
            </Col>
          </Row>
          <button
            onClick={handleNextClick}
            style={{ width: 'auto' }}
            className='btn-modal'
          >
            Next
          </button>
        </Col>
      </Row>
    </div>
  )
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  previewUrl,
  handleImageUpload,
  fileInputRef,
  handleImageClick,
  formData,
  setFormData,
  onSubmit,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div style={formBoxStyle}>
      <Row>
        <Col lg='4' className='d-flex justify-content-center align-items-start'>
          <div
            onClick={handleImageClick}
            style={{
              textAlign: 'center',
              border: previewUrl ? 'none' : '1px solid #7B80DD',
              boxShadow: previewUrl ? 'none' : '1px 1px 9px 0px #CEBDE4',
              borderRadius: '5px',
              padding: previewUrl ? '0' : '50px',
              cursor: 'pointer'
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded'
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div>
                <svg
                  width='71'
                  height='70'
                  viewBox='0 0 71 70'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M61.8149 32.3331V7.99577C61.8149 3.58693 58.5905 0 54.6273 0H7.92007C3.95683 0 0.732422 3.58693 0.732422 7.99577V50.4693C0.732422 54.8781 3.95683 58.4651 7.92007 58.4651H35.6985C38.706 65.0596 44.8488 69.6 51.9388 69.6C61.9831 69.6 70.1548 60.5096 70.1548 49.336C70.1548 42.2128 66.8262 35.9478 61.8149 32.3331ZM7.92007 54.8443C5.7513 54.8443 3.9872 52.8819 3.9872 50.4693V7.99577C3.9872 5.58316 5.7513 3.62073 7.92007 3.62073H54.6273C56.796 3.62073 58.5601 5.58316 58.5601 7.99577V30.4781C56.5042 29.5813 54.2768 29.072 51.9388 29.072C50.8658 29.072 49.82 29.1963 48.7969 29.3955L43.4916 24.598C43.484 24.592 43.4764 24.5883 43.4688 24.5811C43.4232 24.5413 43.3744 24.5099 43.3256 24.4761C43.2811 24.4447 43.2388 24.4109 43.1921 24.3856C43.1574 24.3663 43.1205 24.3542 43.0836 24.3373C43.0207 24.3083 42.9589 24.2782 42.8938 24.2577C42.8699 24.2504 42.8439 24.2492 42.8189 24.242C42.743 24.2227 42.6649 24.2045 42.5878 24.1985C42.5575 24.1961 42.5249 24.1997 42.4945 24.1985C42.4229 24.1973 42.3502 24.1949 42.2786 24.2045C42.2396 24.2094 42.2016 24.2227 42.1625 24.2299C42.0974 24.2432 42.0334 24.2552 41.9705 24.2782C41.9347 24.2914 41.9 24.3108 41.8631 24.3277C41.798 24.3554 41.7351 24.3844 41.6732 24.4218C41.6667 24.4266 41.6591 24.4278 41.6526 24.4327L34.2838 29.1432L25.5241 20.0636C25.5154 20.054 25.5024 20.0516 25.4937 20.0431C25.3462 19.8959 25.1813 19.7861 25.0044 19.7088C24.9827 19.6992 24.9621 19.6895 24.9404 19.6811C24.7636 19.6135 24.5813 19.5821 24.3958 19.5845C24.3719 19.5845 24.348 19.5845 24.3242 19.5857C24.143 19.5966 23.964 19.6436 23.7926 19.7233C23.7676 19.7342 23.7437 19.745 23.7188 19.7583C23.5929 19.8247 23.4714 19.9043 23.3597 20.0093L6.77221 35.7004C6.08762 36.3473 6.00408 37.4902 6.58669 38.2518C6.90783 38.673 7.36675 38.889 7.82676 38.889C8.19998 38.889 8.57428 38.7478 8.88023 38.4581L24.3676 23.8099L37.3433 37.2621C35.0801 40.639 33.7218 44.8101 33.7218 49.336C33.7218 51.2477 33.9768 53.0895 34.4238 54.8443H7.92007ZM39.5121 34.561L36.777 31.726L42.3068 28.1922L44.9855 30.6132C42.9448 31.5558 41.1015 32.9064 39.5121 34.561ZM51.9388 65.9793C43.689 65.9793 36.9777 58.5121 36.9777 49.336C36.9777 40.1599 43.6901 32.6927 51.9388 32.6927C60.1875 32.6927 66.9 40.1599 66.9 49.336C66.9 58.5121 60.1886 65.9793 51.9388 65.9793Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M13.0145 20.3998C16.8423 20.3998 19.9567 16.9005 19.9567 12.5998C19.9567 8.29908 16.8423 4.7998 13.0145 4.7998C9.18672 4.7998 6.07227 8.29908 6.07227 12.5998C6.07227 16.9005 9.18672 20.3998 13.0145 20.3998ZM13.0145 8.49759C15.0272 8.49759 16.6645 10.3372 16.6645 12.5986C16.6645 14.8599 15.0272 16.6996 13.0145 16.6996C11.0018 16.6996 9.3645 14.8599 9.3645 12.5986C9.3645 10.3372 11.0018 8.49759 13.0145 8.49759Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M53.0971 38.838C53.0902 38.8319 53.0823 38.8281 53.0743 38.822C53.0505 38.7985 53.0232 38.78 52.9982 38.759C52.9584 38.7282 52.9164 38.6986 52.8744 38.6714C52.8471 38.6529 52.821 38.6332 52.7926 38.6159C52.7676 38.6011 52.7392 38.59 52.7142 38.5764C52.6699 38.5542 52.6255 38.5369 52.5801 38.5184C52.5483 38.5048 52.5165 38.49 52.4835 38.4789C52.4574 38.4702 52.429 38.4653 52.4029 38.4579C52.3574 38.4456 52.3108 38.4369 52.2642 38.4295C52.2302 38.4234 52.1961 38.4147 52.162 38.411C52.1313 38.4073 52.0984 38.4085 52.0677 38.4073C52.0438 38.4061 52.0223 38.3999 51.9984 38.3999C51.9745 38.3999 51.9529 38.4061 51.9291 38.4073C51.8984 38.4085 51.8655 38.4073 51.8348 38.411C51.8007 38.4147 51.7666 38.4234 51.7325 38.4295C51.6859 38.4382 51.6394 38.4468 51.5939 38.4579C51.5678 38.4653 51.5394 38.4702 51.5132 38.4789C51.4803 38.49 51.4485 38.5048 51.4167 38.5184C51.3712 38.5369 51.3269 38.5542 51.2826 38.5764C51.2576 38.59 51.2303 38.6023 51.2042 38.6159C51.1769 38.6332 51.1497 38.6529 51.1213 38.6714C51.0792 38.6986 51.0383 38.7282 50.9997 38.759C50.9736 38.78 50.9463 38.7985 50.9224 38.822C50.9145 38.8281 50.9065 38.8319 50.8997 38.838L44.0589 45.1136C43.3397 45.7727 43.2488 46.9402 43.8567 47.7214C44.193 48.1558 44.6747 48.378 45.1587 48.378C45.5473 48.378 45.9381 48.2348 46.2574 47.9411L50.2942 44.2374V58.1487C50.2942 59.1706 51.0577 59.9999 51.9984 59.9999C52.9391 59.9999 53.7026 59.1706 53.7026 58.1487V44.2386L57.7394 47.9423C58.0587 48.236 58.4495 48.3792 58.8381 48.3792C59.3232 48.3792 59.8049 48.1558 60.1401 47.7226C60.7479 46.9414 60.6571 45.7739 59.9379 45.1149L53.0971 38.838Z'
                    fill='#D3CECE'
                  />
                </svg>
                <p>Upload Logo</p>
              </div>
            )}

            <Form.Control
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </Col>
        <Col lg='8'>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='firstName'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  name='firstName'
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter first name'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='lastName'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  name='lastName'
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter last name'
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='number'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='tel'
                  name='phoneNumberp'
                  value={formData.phoneNumberp || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter phone number'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='title'>
                <Form.Label>Title</Form.Label>
                <Select
                  options={[
                    { value: 'Mr', label: 'Mr' },
                    { value: 'Ms', label: 'Ms' },
                    { value: 'Mrs', label: 'Mrs' }
                  ]}
                  value={
                    formData.title
                      ? { value: formData.title, label: formData.title }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      title: selectedOption?.value || ''
                    })
                  }
                  placeholder='Select Title'
                />{' '}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your email address'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='lastName'>
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type='text'
                  name='designation'
                  value={formData.designation || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter Designation'
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className='mb-4' controlId='addessp'>
            <Form.Label>Contact/Mailing Address</Form.Label>
            <Form.Control
              as='textarea'
              rows={2}
              name='addressp'
              value={formData.addressp || ''}
              onChange={handleInputChange}
              placeholder='Enter address'
            />
          </Form.Group>
          <button
            onClick={onSubmit}
            style={{ width: 'auto' }}
            className='btn-modal'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className='spinner-border spinner-border-sm'
                  role='status'
                  aria-hidden='true'
                ></span>
                <span className='ms-2'>Loading...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
        </Col>
      </Row>
    </div>
  )
}

const PersonalDetailsDonorForm: React.FC<PersonalDetailsFormProps> = ({
  previewUrl,
  handleImageUpload,
  fileInputRef,
  handleImageClick,
  formData,
  setFormData,
  onSubmit,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div style={formBoxStyle}>
      <Row>
        <Col lg='4' className='d-flex justify-content-center align-items-start'>
          <div
            onClick={handleImageClick}
            style={{
              textAlign: 'center',
              border: previewUrl ? 'none' : '1px solid #7B80DD',
              boxShadow: previewUrl ? 'none' : '1px 1px 9px 0px #CEBDE4',
              borderRadius: '5px',
              padding: previewUrl ? '0' : '50px',
              cursor: 'pointer'
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded'
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div>
                <svg
                  width='71'
                  height='70'
                  viewBox='0 0 71 70'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M61.8149 32.3331V7.99577C61.8149 3.58693 58.5905 0 54.6273 0H7.92007C3.95683 0 0.732422 3.58693 0.732422 7.99577V50.4693C0.732422 54.8781 3.95683 58.4651 7.92007 58.4651H35.6985C38.706 65.0596 44.8488 69.6 51.9388 69.6C61.9831 69.6 70.1548 60.5096 70.1548 49.336C70.1548 42.2128 66.8262 35.9478 61.8149 32.3331ZM7.92007 54.8443C5.7513 54.8443 3.9872 52.8819 3.9872 50.4693V7.99577C3.9872 5.58316 5.7513 3.62073 7.92007 3.62073H54.6273C56.796 3.62073 58.5601 5.58316 58.5601 7.99577V30.4781C56.5042 29.5813 54.2768 29.072 51.9388 29.072C50.8658 29.072 49.82 29.1963 48.7969 29.3955L43.4916 24.598C43.484 24.592 43.4764 24.5883 43.4688 24.5811C43.4232 24.5413 43.3744 24.5099 43.3256 24.4761C43.2811 24.4447 43.2388 24.4109 43.1921 24.3856C43.1574 24.3663 43.1205 24.3542 43.0836 24.3373C43.0207 24.3083 42.9589 24.2782 42.8938 24.2577C42.8699 24.2504 42.8439 24.2492 42.8189 24.242C42.743 24.2227 42.6649 24.2045 42.5878 24.1985C42.5575 24.1961 42.5249 24.1997 42.4945 24.1985C42.4229 24.1973 42.3502 24.1949 42.2786 24.2045C42.2396 24.2094 42.2016 24.2227 42.1625 24.2299C42.0974 24.2432 42.0334 24.2552 41.9705 24.2782C41.9347 24.2914 41.9 24.3108 41.8631 24.3277C41.798 24.3554 41.7351 24.3844 41.6732 24.4218C41.6667 24.4266 41.6591 24.4278 41.6526 24.4327L34.2838 29.1432L25.5241 20.0636C25.5154 20.054 25.5024 20.0516 25.4937 20.0431C25.3462 19.8959 25.1813 19.7861 25.0044 19.7088C24.9827 19.6992 24.9621 19.6895 24.9404 19.6811C24.7636 19.6135 24.5813 19.5821 24.3958 19.5845C24.3719 19.5845 24.348 19.5845 24.3242 19.5857C24.143 19.5966 23.964 19.6436 23.7926 19.7233C23.7676 19.7342 23.7437 19.745 23.7188 19.7583C23.5929 19.8247 23.4714 19.9043 23.3597 20.0093L6.77221 35.7004C6.08762 36.3473 6.00408 37.4902 6.58669 38.2518C6.90783 38.673 7.36675 38.889 7.82676 38.889C8.19998 38.889 8.57428 38.7478 8.88023 38.4581L24.3676 23.8099L37.3433 37.2621C35.0801 40.639 33.7218 44.8101 33.7218 49.336C33.7218 51.2477 33.9768 53.0895 34.4238 54.8443H7.92007ZM39.5121 34.561L36.777 31.726L42.3068 28.1922L44.9855 30.6132C42.9448 31.5558 41.1015 32.9064 39.5121 34.561ZM51.9388 65.9793C43.689 65.9793 36.9777 58.5121 36.9777 49.336C36.9777 40.1599 43.6901 32.6927 51.9388 32.6927C60.1875 32.6927 66.9 40.1599 66.9 49.336C66.9 58.5121 60.1886 65.9793 51.9388 65.9793Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M13.0145 20.3998C16.8423 20.3998 19.9567 16.9005 19.9567 12.5998C19.9567 8.29908 16.8423 4.7998 13.0145 4.7998C9.18672 4.7998 6.07227 8.29908 6.07227 12.5998C6.07227 16.9005 9.18672 20.3998 13.0145 20.3998ZM13.0145 8.49759C15.0272 8.49759 16.6645 10.3372 16.6645 12.5986C16.6645 14.8599 15.0272 16.6996 13.0145 16.6996C11.0018 16.6996 9.3645 14.8599 9.3645 12.5986C9.3645 10.3372 11.0018 8.49759 13.0145 8.49759Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M53.0971 38.838C53.0902 38.8319 53.0823 38.8281 53.0743 38.822C53.0505 38.7985 53.0232 38.78 52.9982 38.759C52.9584 38.7282 52.9164 38.6986 52.8744 38.6714C52.8471 38.6529 52.821 38.6332 52.7926 38.6159C52.7676 38.6011 52.7392 38.59 52.7142 38.5764C52.6699 38.5542 52.6255 38.5369 52.5801 38.5184C52.5483 38.5048 52.5165 38.49 52.4835 38.4789C52.4574 38.4702 52.429 38.4653 52.4029 38.4579C52.3574 38.4456 52.3108 38.4369 52.2642 38.4295C52.2302 38.4234 52.1961 38.4147 52.162 38.411C52.1313 38.4073 52.0984 38.4085 52.0677 38.4073C52.0438 38.4061 52.0223 38.3999 51.9984 38.3999C51.9745 38.3999 51.9529 38.4061 51.9291 38.4073C51.8984 38.4085 51.8655 38.4073 51.8348 38.411C51.8007 38.4147 51.7666 38.4234 51.7325 38.4295C51.6859 38.4382 51.6394 38.4468 51.5939 38.4579C51.5678 38.4653 51.5394 38.4702 51.5132 38.4789C51.4803 38.49 51.4485 38.5048 51.4167 38.5184C51.3712 38.5369 51.3269 38.5542 51.2826 38.5764C51.2576 38.59 51.2303 38.6023 51.2042 38.6159C51.1769 38.6332 51.1497 38.6529 51.1213 38.6714C51.0792 38.6986 51.0383 38.7282 50.9997 38.759C50.9736 38.78 50.9463 38.7985 50.9224 38.822C50.9145 38.8281 50.9065 38.8319 50.8997 38.838L44.0589 45.1136C43.3397 45.7727 43.2488 46.9402 43.8567 47.7214C44.193 48.1558 44.6747 48.378 45.1587 48.378C45.5473 48.378 45.9381 48.2348 46.2574 47.9411L50.2942 44.2374V58.1487C50.2942 59.1706 51.0577 59.9999 51.9984 59.9999C52.9391 59.9999 53.7026 59.1706 53.7026 58.1487V44.2386L57.7394 47.9423C58.0587 48.236 58.4495 48.3792 58.8381 48.3792C59.3232 48.3792 59.8049 48.1558 60.1401 47.7226C60.7479 46.9414 60.6571 45.7739 59.9379 45.1149L53.0971 38.838Z'
                    fill='#D3CECE'
                  />
                </svg>
                <p>Upload Logo</p>
              </div>
            )}

            <Form.Control
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </Col>
        <Col lg='8'>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='name'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter first name'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='lastName'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  name='lastName'
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter last name'
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='number'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='tel'
                  name='phoneNumber'
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter phone number'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='title'>
                <Form.Label>Title</Form.Label>
                <Select
                  options={[
                    { value: 'Mr', label: 'Mr' },
                    { value: 'Ms', label: 'Ms' },
                    { value: 'Mrs', label: 'Mrs' }
                  ]}
                  value={
                    formData.title
                      ? { value: formData.title, label: formData.title }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      title: selectedOption?.value || ''
                    })
                  }
                  placeholder='Select Title'
                />{' '}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your email address'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='nationality'>
                <Form.Label>Nationality</Form.Label>
                <Select
                  options={[{ value: 'NG', label: 'Nigeria' }]}
                  value={
                    formData.nationality
                      ? {
                          value: formData.nationality,
                          label: formData.nationality
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      nationality: selectedOption?.value || ''
                    })
                  }
                  placeholder='Select nationality'
                />{' '}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='clearance'>
                <Form.Label>PEP Clearance</Form.Label>
                <Form.Control
                  type='text'
                  name='clearance'
                  value={formData.clearance || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter clearance'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='certificate_number'>
                <Form.Label>Certificate/particulars number</Form.Label>
                <Form.Control
                  type='text'
                  name='certificate_number'
                  value={formData.certificate_number || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter certificate/particulars number'
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='bvn'>
                <Form.Label>BVN</Form.Label>
                <Form.Control
                  type='number'
                  name='bvn'
                  value={formData.bvn || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter BVN'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='nin'>
                <Form.Label>NIN</Form.Label>
                <Form.Control
                  type='number'
                  name='nin'
                  value={formData.nin || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter NIN'
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className='mb-4' controlId='address'>
            <Form.Label>Contact/Mailing Address</Form.Label>
            <Form.Control
              as='textarea'
              rows={2}
              name='address'
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder='Enter address'
            />
          </Form.Group>
          <button
            onClick={onSubmit}
            style={{ width: 'auto' }}
            className='btn-modal'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className='spinner-border spinner-border-sm'
                  role='status'
                  aria-hidden='true'
                ></span>
                <span className='ms-2'>Loading...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
        </Col>
      </Row>
    </div>
  )
}

const Org: React.FC<any> = ({
  previewUrl,
  handleImageUpload,
  handleStateChange,
  selectedState,
  lgas,
  handleLGAChange,
  selectedLGA,
  fileInputRef,
  handleImageClick,
  areas,
  formData,
  setFormData,
  onNext,
  handlefileUpload
}) => {
  const [registrationNumberError, setRegistrationNumberError] =
    useState<string>('')
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target

    if (name === 'cac') {
      e.preventDefault()
      try {
        setRegistrationNumberError('')

        // await Util.checkIfCompanyRegistrationNumberIsValid(value)
        setFormData({ ...formData, [name]: value })
      } catch (err: any) {
        setFormData({ ...formData, [name]: '' })
        setRegistrationNumberError(err.response.data.message)
        toast.error('Invalid CAC. validation not successsful')
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent page refresh
    onNext() // Trigger the onNext function
  }

  return (
    <div className='mt-5 mx-box' id='form' style={formBoxStyle}>
      <Row>
        <Col lg='4' className='d-flex justify-content-center align-items-start'>
          <div
            onClick={handleImageClick}
            style={{
              textAlign: 'center',
              border: previewUrl ? 'none' : '1px solid #7B80DD',
              boxShadow: previewUrl ? 'none' : '1px 1px 9px 0px #CEBDE4',
              borderRadius: '5px',
              padding: previewUrl ? '0' : '50px',
              cursor: 'pointer'
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded'
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div>
                <svg
                  width='71'
                  height='70'
                  viewBox='0 0 71 70'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M61.8149 32.3331V7.99577C61.8149 3.58693 58.5905 0 54.6273 0H7.92007C3.95683 0 0.732422 3.58693 0.732422 7.99577V50.4693C0.732422 54.8781 3.95683 58.4651 7.92007 58.4651H35.6985C38.706 65.0596 44.8488 69.6 51.9388 69.6C61.9831 69.6 70.1548 60.5096 70.1548 49.336C70.1548 42.2128 66.8262 35.9478 61.8149 32.3331ZM7.92007 54.8443C5.7513 54.8443 3.9872 52.8819 3.9872 50.4693V7.99577C3.9872 5.58316 5.7513 3.62073 7.92007 3.62073H54.6273C56.796 3.62073 58.5601 5.58316 58.5601 7.99577V30.4781C56.5042 29.5813 54.2768 29.072 51.9388 29.072C50.8658 29.072 49.82 29.1963 48.7969 29.3955L43.4916 24.598C43.484 24.592 43.4764 24.5883 43.4688 24.5811C43.4232 24.5413 43.3744 24.5099 43.3256 24.4761C43.2811 24.4447 43.2388 24.4109 43.1921 24.3856C43.1574 24.3663 43.1205 24.3542 43.0836 24.3373C43.0207 24.3083 42.9589 24.2782 42.8938 24.2577C42.8699 24.2504 42.8439 24.2492 42.8189 24.242C42.743 24.2227 42.6649 24.2045 42.5878 24.1985C42.5575 24.1961 42.5249 24.1997 42.4945 24.1985C42.4229 24.1973 42.3502 24.1949 42.2786 24.2045C42.2396 24.2094 42.2016 24.2227 42.1625 24.2299C42.0974 24.2432 42.0334 24.2552 41.9705 24.2782C41.9347 24.2914 41.9 24.3108 41.8631 24.3277C41.798 24.3554 41.7351 24.3844 41.6732 24.4218C41.6667 24.4266 41.6591 24.4278 41.6526 24.4327L34.2838 29.1432L25.5241 20.0636C25.5154 20.054 25.5024 20.0516 25.4937 20.0431C25.3462 19.8959 25.1813 19.7861 25.0044 19.7088C24.9827 19.6992 24.9621 19.6895 24.9404 19.6811C24.7636 19.6135 24.5813 19.5821 24.3958 19.5845C24.3719 19.5845 24.348 19.5845 24.3242 19.5857C24.143 19.5966 23.964 19.6436 23.7926 19.7233C23.7676 19.7342 23.7437 19.745 23.7188 19.7583C23.5929 19.8247 23.4714 19.9043 23.3597 20.0093L6.77221 35.7004C6.08762 36.3473 6.00408 37.4902 6.58669 38.2518C6.90783 38.673 7.36675 38.889 7.82676 38.889C8.19998 38.889 8.57428 38.7478 8.88023 38.4581L24.3676 23.8099L37.3433 37.2621C35.0801 40.639 33.7218 44.8101 33.7218 49.336C33.7218 51.2477 33.9768 53.0895 34.4238 54.8443H7.92007ZM39.5121 34.561L36.777 31.726L42.3068 28.1922L44.9855 30.6132C42.9448 31.5558 41.1015 32.9064 39.5121 34.561ZM51.9388 65.9793C43.689 65.9793 36.9777 58.5121 36.9777 49.336C36.9777 40.1599 43.6901 32.6927 51.9388 32.6927C60.1875 32.6927 66.9 40.1599 66.9 49.336C66.9 58.5121 60.1886 65.9793 51.9388 65.9793Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M13.0145 20.3998C16.8423 20.3998 19.9567 16.9005 19.9567 12.5998C19.9567 8.29908 16.8423 4.7998 13.0145 4.7998C9.18672 4.7998 6.07227 8.29908 6.07227 12.5998C6.07227 16.9005 9.18672 20.3998 13.0145 20.3998ZM13.0145 8.49759C15.0272 8.49759 16.6645 10.3372 16.6645 12.5986C16.6645 14.8599 15.0272 16.6996 13.0145 16.6996C11.0018 16.6996 9.3645 14.8599 9.3645 12.5986C9.3645 10.3372 11.0018 8.49759 13.0145 8.49759Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M53.0971 38.838C53.0902 38.8319 53.0823 38.8281 53.0743 38.822C53.0505 38.7985 53.0232 38.78 52.9982 38.759C52.9584 38.7282 52.9164 38.6986 52.8744 38.6714C52.8471 38.6529 52.821 38.6332 52.7926 38.6159C52.7676 38.6011 52.7392 38.59 52.7142 38.5764C52.6699 38.5542 52.6255 38.5369 52.5801 38.5184C52.5483 38.5048 52.5165 38.49 52.4835 38.4789C52.4574 38.4702 52.429 38.4653 52.4029 38.4579C52.3574 38.4456 52.3108 38.4369 52.2642 38.4295C52.2302 38.4234 52.1961 38.4147 52.162 38.411C52.1313 38.4073 52.0984 38.4085 52.0677 38.4073C52.0438 38.4061 52.0223 38.3999 51.9984 38.3999C51.9745 38.3999 51.9529 38.4061 51.9291 38.4073C51.8984 38.4085 51.8655 38.4073 51.8348 38.411C51.8007 38.4147 51.7666 38.4234 51.7325 38.4295C51.6859 38.4382 51.6394 38.4468 51.5939 38.4579C51.5678 38.4653 51.5394 38.4702 51.5132 38.4789C51.4803 38.49 51.4485 38.5048 51.4167 38.5184C51.3712 38.5369 51.3269 38.5542 51.2826 38.5764C51.2576 38.59 51.2303 38.6023 51.2042 38.6159C51.1769 38.6332 51.1497 38.6529 51.1213 38.6714C51.0792 38.6986 51.0383 38.7282 50.9997 38.759C50.9736 38.78 50.9463 38.7985 50.9224 38.822C50.9145 38.8281 50.9065 38.8319 50.8997 38.838L44.0589 45.1136C43.3397 45.7727 43.2488 46.9402 43.8567 47.7214C44.193 48.1558 44.6747 48.378 45.1587 48.378C45.5473 48.378 45.9381 48.2348 46.2574 47.9411L50.2942 44.2374V58.1487C50.2942 59.1706 51.0577 59.9999 51.9984 59.9999C52.9391 59.9999 53.7026 59.1706 53.7026 58.1487V44.2386L57.7394 47.9423C58.0587 48.236 58.4495 48.3792 58.8381 48.3792C59.3232 48.3792 59.8049 48.1558 60.1401 47.7226C60.7479 46.9414 60.6571 45.7739 59.9379 45.1149L53.0971 38.838Z'
                    fill='#D3CECE'
                  />
                </svg>
                <p>Upload Logo</p>
              </div>
            )}

            <Form.Control
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </Col>
        <Col lg='8'>
          <Form.Group className='mb-4' controlId='name'>
            <Form.Label>Name of Organization</Form.Label>
            <Form.Control
              type='text'
              name='name'
              onChange={handleInputChange}
              required
              placeholder='Enter the name of your Organization'
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='phone'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='text'
                  name='phone'
                  onChange={handleInputChange}
                  required
                  placeholder='Enter Phone Number'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='interest_area'>
                <Form.Label>Area of Interest</Form.Label>
                <Select
                  options={areas.map((category) => ({
                    value: category.name,
                    label: category.name
                  }))}
                  placeholder='Select Area of Interest'
                  value={
                    formData.interest_area
                      ? formData.interest_area.split(',').map((value) => ({
                          value,
                          label: value
                        }))
                      : []
                  }
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map(
                      (option) => option.value
                    )
                    setFormData({
                      ...formData,
                      interest_area: selectedValues.join(',')
                    })
                  }}
                  isMulti
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='fileUploadCAC'>
                <Form.Label>Company Certificate of Registration</Form.Label>
                <Form.Control
                  className=''
                  onChange={handlefileUpload}
                  type='file'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='cac'>
                <Form.Label>Company Registration No</Form.Label>
                <Form.Control
                  type='text'
                  required
                  name='cac'
                  onChange={handleInputChange}
                  placeholder='Enter Company Registration No'
                />
                {registrationNumberError && (
                  <Form.Text className='text-danger'>
                    {registrationNumberError}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='state'>
                <Form.Label>State</Form.Label>
                <Select
                  options={Array.from(States.keys()).map((state) => ({
                    value: state as string,
                    label: state as string
                  }))}
                  onChange={handleStateChange}
                  placeholder='Select State'
                  value={
                    selectedState
                      ? { value: selectedState, label: selectedState }
                      : null
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='lga'>
                <Form.Label>City/LGA</Form.Label>
                <Select
                  options={lgas.map((lga) => ({
                    value: lga,
                    label: lga
                  }))}
                  onChange={handleLGAChange}
                  placeholder='Select LGA'
                  value={
                    selectedLGA
                      ? { value: selectedLGA, label: selectedLGA }
                      : null
                  }
                  isDisabled={!selectedState}
                />
              </Form.Group>
            </Col>
          </Row>{' '}
          <Form.Group className='mb-4' controlId='website'>
            <Form.Label>Website of Organization</Form.Label>
            <Form.Control
              type='text'
              name='website'
              onChange={handleInputChange}
              placeholder='Enter Website of Organization'
            />
          </Form.Group>
          <Form.Group className='mb-4' controlId='address'>
            <Form.Label>Address of Organization</Form.Label>
            <Form.Control
              as='textarea'
              name='address'
              onChange={handleInputChange}
              rows={2}
              placeholder='Enter Address of Organization'
            />
          </Form.Group>
          <button
            onClick={handleNextClick}
            style={{ width: 'auto' }}
            className='btn-modal'
          >
            Next
          </button>
        </Col>
      </Row>
    </div>
  )
}

const KYC: React.FC<any> = ({
  previewUrl,
  handleImageUpload,
  fileInputRef,
  handleImageClick,
  formData,
  setFormData,
  onSubmit,
  isLoading
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div style={formBoxStyle}>
      <Row>
        <Col lg='4' className='d-flex justify-content-center align-items-start'>
          <div
            onClick={handleImageClick}
            style={{
              textAlign: 'center',
              border: previewUrl ? 'none' : '1px solid #7B80DD',
              boxShadow: previewUrl ? 'none' : '1px 1px 9px 0px #CEBDE4',
              borderRadius: '5px',
              padding: previewUrl ? '0' : '50px',
              cursor: 'pointer'
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Uploaded'
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div>
                <svg
                  width='71'
                  height='70'
                  viewBox='0 0 71 70'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M61.8149 32.3331V7.99577C61.8149 3.58693 58.5905 0 54.6273 0H7.92007C3.95683 0 0.732422 3.58693 0.732422 7.99577V50.4693C0.732422 54.8781 3.95683 58.4651 7.92007 58.4651H35.6985C38.706 65.0596 44.8488 69.6 51.9388 69.6C61.9831 69.6 70.1548 60.5096 70.1548 49.336C70.1548 42.2128 66.8262 35.9478 61.8149 32.3331ZM7.92007 54.8443C5.7513 54.8443 3.9872 52.8819 3.9872 50.4693V7.99577C3.9872 5.58316 5.7513 3.62073 7.92007 3.62073H54.6273C56.796 3.62073 58.5601 5.58316 58.5601 7.99577V30.4781C56.5042 29.5813 54.2768 29.072 51.9388 29.072C50.8658 29.072 49.82 29.1963 48.7969 29.3955L43.4916 24.598C43.484 24.592 43.4764 24.5883 43.4688 24.5811C43.4232 24.5413 43.3744 24.5099 43.3256 24.4761C43.2811 24.4447 43.2388 24.4109 43.1921 24.3856C43.1574 24.3663 43.1205 24.3542 43.0836 24.3373C43.0207 24.3083 42.9589 24.2782 42.8938 24.2577C42.8699 24.2504 42.8439 24.2492 42.8189 24.242C42.743 24.2227 42.6649 24.2045 42.5878 24.1985C42.5575 24.1961 42.5249 24.1997 42.4945 24.1985C42.4229 24.1973 42.3502 24.1949 42.2786 24.2045C42.2396 24.2094 42.2016 24.2227 42.1625 24.2299C42.0974 24.2432 42.0334 24.2552 41.9705 24.2782C41.9347 24.2914 41.9 24.3108 41.8631 24.3277C41.798 24.3554 41.7351 24.3844 41.6732 24.4218C41.6667 24.4266 41.6591 24.4278 41.6526 24.4327L34.2838 29.1432L25.5241 20.0636C25.5154 20.054 25.5024 20.0516 25.4937 20.0431C25.3462 19.8959 25.1813 19.7861 25.0044 19.7088C24.9827 19.6992 24.9621 19.6895 24.9404 19.6811C24.7636 19.6135 24.5813 19.5821 24.3958 19.5845C24.3719 19.5845 24.348 19.5845 24.3242 19.5857C24.143 19.5966 23.964 19.6436 23.7926 19.7233C23.7676 19.7342 23.7437 19.745 23.7188 19.7583C23.5929 19.8247 23.4714 19.9043 23.3597 20.0093L6.77221 35.7004C6.08762 36.3473 6.00408 37.4902 6.58669 38.2518C6.90783 38.673 7.36675 38.889 7.82676 38.889C8.19998 38.889 8.57428 38.7478 8.88023 38.4581L24.3676 23.8099L37.3433 37.2621C35.0801 40.639 33.7218 44.8101 33.7218 49.336C33.7218 51.2477 33.9768 53.0895 34.4238 54.8443H7.92007ZM39.5121 34.561L36.777 31.726L42.3068 28.1922L44.9855 30.6132C42.9448 31.5558 41.1015 32.9064 39.5121 34.561ZM51.9388 65.9793C43.689 65.9793 36.9777 58.5121 36.9777 49.336C36.9777 40.1599 43.6901 32.6927 51.9388 32.6927C60.1875 32.6927 66.9 40.1599 66.9 49.336C66.9 58.5121 60.1886 65.9793 51.9388 65.9793Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M13.0145 20.3998C16.8423 20.3998 19.9567 16.9005 19.9567 12.5998C19.9567 8.29908 16.8423 4.7998 13.0145 4.7998C9.18672 4.7998 6.07227 8.29908 6.07227 12.5998C6.07227 16.9005 9.18672 20.3998 13.0145 20.3998ZM13.0145 8.49759C15.0272 8.49759 16.6645 10.3372 16.6645 12.5986C16.6645 14.8599 15.0272 16.6996 13.0145 16.6996C11.0018 16.6996 9.3645 14.8599 9.3645 12.5986C9.3645 10.3372 11.0018 8.49759 13.0145 8.49759Z'
                    fill='#D3CECE'
                  />
                  <path
                    d='M53.0971 38.838C53.0902 38.8319 53.0823 38.8281 53.0743 38.822C53.0505 38.7985 53.0232 38.78 52.9982 38.759C52.9584 38.7282 52.9164 38.6986 52.8744 38.6714C52.8471 38.6529 52.821 38.6332 52.7926 38.6159C52.7676 38.6011 52.7392 38.59 52.7142 38.5764C52.6699 38.5542 52.6255 38.5369 52.5801 38.5184C52.5483 38.5048 52.5165 38.49 52.4835 38.4789C52.4574 38.4702 52.429 38.4653 52.4029 38.4579C52.3574 38.4456 52.3108 38.4369 52.2642 38.4295C52.2302 38.4234 52.1961 38.4147 52.162 38.411C52.1313 38.4073 52.0984 38.4085 52.0677 38.4073C52.0438 38.4061 52.0223 38.3999 51.9984 38.3999C51.9745 38.3999 51.9529 38.4061 51.9291 38.4073C51.8984 38.4085 51.8655 38.4073 51.8348 38.411C51.8007 38.4147 51.7666 38.4234 51.7325 38.4295C51.6859 38.4382 51.6394 38.4468 51.5939 38.4579C51.5678 38.4653 51.5394 38.4702 51.5132 38.4789C51.4803 38.49 51.4485 38.5048 51.4167 38.5184C51.3712 38.5369 51.3269 38.5542 51.2826 38.5764C51.2576 38.59 51.2303 38.6023 51.2042 38.6159C51.1769 38.6332 51.1497 38.6529 51.1213 38.6714C51.0792 38.6986 51.0383 38.7282 50.9997 38.759C50.9736 38.78 50.9463 38.7985 50.9224 38.822C50.9145 38.8281 50.9065 38.8319 50.8997 38.838L44.0589 45.1136C43.3397 45.7727 43.2488 46.9402 43.8567 47.7214C44.193 48.1558 44.6747 48.378 45.1587 48.378C45.5473 48.378 45.9381 48.2348 46.2574 47.9411L50.2942 44.2374V58.1487C50.2942 59.1706 51.0577 59.9999 51.9984 59.9999C52.9391 59.9999 53.7026 59.1706 53.7026 58.1487V44.2386L57.7394 47.9423C58.0587 48.236 58.4495 48.3792 58.8381 48.3792C59.3232 48.3792 59.8049 48.1558 60.1401 47.7226C60.7479 46.9414 60.6571 45.7739 59.9379 45.1149L53.0971 38.838Z'
                    fill='#D3CECE'
                  />
                </svg>
                <p>Upload Logo</p>
              </div>
            )}

            <Form.Control
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </Col>
        <Col lg='8'>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='bvn'>
                <Form.Label>Bank Verification Number (BVN)</Form.Label>
                <Form.Control
                  type='number'
                  name='bvn'
                  value={formData.bvn || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter yuor BVN'
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='accountNumber'>
                <Form.Label>Bank Account Number</Form.Label>
                <Form.Control
                  type='number'
                  name='accountNumber'
                  value={formData.accountNumber || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your Bank Account Number'
                  maxLength={10}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-4' controlId='bank'>
                <Form.Label>Bank</Form.Label>
                <Select
                  options={Banks.map((category) => ({
                    value: category.name,
                    label: category.name
                  }))}
                  placeholder='Select Bank'
                  value={
                    formData.bankName
                      ? {
                          value: formData.bankName,
                          label: formData.bankName
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      bankName: selectedOption?.value || ''
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-4' controlId='accountName'>
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                  type='text'
                  name='accountName'
                  value={formData.accountName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your Organization Bank Account Name'
                />
              </Form.Group>
            </Col>
          </Row>

          <button
            onClick={onSubmit}
            style={{ width: 'auto' }}
            className='btn-modal'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className='spinner-border spinner-border-sm'
                  role='status'
                  aria-hidden='true'
                ></span>
                <span className='ms-2'>Loading...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
        </Col>
      </Row>
    </div>
  )
}

export default SignUp
