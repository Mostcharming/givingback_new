import usePageChange from '../../components/pageChange'
import AddBriefProvider from './add-brief-context'
import ProjectBeneficiaries from './create-project-options/project-beneficiaries'
// import ProjectExecutors from './create-project-options/project-executors'
// import ProjectInitiate from './create-project-options/project-initiate'
// import ProjectMilestones from './create-project-options/project-milestones'
import ProjectOverview from './create-project-options/project-overview'

const headers = [
  'Overview',
  'Beneficiaries',
  'Milestones',
  'Executors',
  'Initiate'
]

const CreateProject = ({ donor = null }) => {
  const { page, changePage } = usePageChange()
  return (
    <AddBriefProvider>
      <div className='d-flex justify-content-center'>
        <h4 className='mt-4'>Initiate A Project brief</h4>
      </div>
      {page === 1 && (
        <ProjectOverview
          page={page}
          headers={headers}
          changePage={changePage}
          donor={donor}
        />
      )}
      {page === 2 && (
        <ProjectBeneficiaries
          page={page}
          headers={headers}
          changePage={changePage}
        />
      )}
      {/*
      {page === 3 && (
        <ProjectMilestones
          page={page}
          headers={headers}
          changePage={changePage}
        />
      )}
      {page === 4 && (
        <ProjectExecutors
          page={page}
          headers={headers}
          changePage={changePage}
        />
      )}
      {page === 5 && (
        <ProjectInitiate
          donor={donor}
          page={page}
          headers={headers}
          changePage={changePage}
        />
      )} */}
    </AddBriefProvider>
  )
}
export default CreateProject
