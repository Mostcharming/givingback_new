import { Container } from 'reactstrap'
import usePageChange from '../../../components/pageChange'
import AddPastProjectContextProvider from '../add-past-project-context'
import ProgressHeader from '../progress-header'
import Beneficiaries from './beneficaries'
import Details from './details'
import Media from './media'
import Sponsors from './sponsors'
const headers = ['Project Details', 'Sponsors', 'Beneficiaries', 'Media']

const AddPastProject = () => {
  const { page, changePage } = usePageChange()

  return (
    <Container fluid>
      <AddPastProjectContextProvider>
        <div className=''>
          <ProgressHeader page={page} headers={headers} />
          <div className='bg-white p-4'>
            {page === 1 && <Details changePage={changePage} edit={false} />}
            {page === 2 && <Sponsors changePage={changePage} edit={false} />}
            {page === 3 && (
              <Beneficiaries changePage={changePage} edit={false} />
            )}
            {page === 4 && <Media changePage={changePage} />}
          </div>
        </div>
      </AddPastProjectContextProvider>
    </Container>
  )
}

export default AddPastProject
