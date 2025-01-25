import { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/home/loading'
import PageBanner from '../../components/home/pageBanner'
import ProjectCard from '../../components/projects/project-card'
import Layout from '../../layouts/home'
import useBackendService from '../../services/backend_service'
import { useLoadStyles } from '../../services/styles'

const LatestProject = () => {
  useLoadStyles(['givingback'])

  const [projects, setProjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { mutate: getAllProjects, isLoading } = useBackendService(
    '/allprojects',
    'GET',
    {
      onSuccess: (res: any) => {
        setProjects(res.projects)
      },
      onError: (err: any) => {
        toast.error(err.message)
      }
    }
  )

  useEffect(() => {
    const fetchProjects = async (status: string) => {
      if (status === 'all') {
        getAllProjects({ page: 1, limit: 6 })
      } else {
        getAllProjects({
          page: 1,
          limit: 6,
          projectType: status
        })
      }
    }

    fetchProjects(activeTab)
  }, [activeTab])

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    getAllProjects({
      page: 1,
      limit: 6,
      title: searchTerm
    })
  }

  return (
    <Layout>
      <PageBanner pageName='Projects' />
      <section className='project-section section-gap-extra-bottom primary-soft-bg'>
        <div className='container'>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='search-bar' style={{ textAlign: 'right' }}>
              <form
                onSubmit={handleSearch}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search...'
                  style={{
                    borderRadius: '20px',
                    padding: '5px 15px',
                    marginRight: '10px'
                  }}
                />
                <button
                  type='submit'
                  style={{
                    borderRadius: '50%',
                    padding: '10px 15px',
                    backgroundColor: '#02a95c',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  <i className='fas fa-search'></i>
                </button>
              </form>
            </div>
            <Tabs
              id='project-tabs'
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k!)}
            >
              <Tab eventKey='all' title='All'>
                {isLoading ? (
                  <Loading type={'inline'} />
                ) : (
                  <div className='row project-items justify-content-center project-style-one'>
                    {projects.slice(0, 6).map((project) => (
                      <ProjectCard project={project} key={project.id} />
                    ))}
                  </div>
                )}
              </Tab>
              <Tab eventKey='present' title='Present'>
                {isLoading ? (
                  <Loading type={'inline'} />
                ) : (
                  <div className='row project-items justify-content-center project-style-one'>
                    {projects.slice(0, 6).map((project) => (
                      <ProjectCard project={project} key={project.id} />
                    ))}
                  </div>
                )}
              </Tab>
              <Tab eventKey='previous' title='Previous'>
                {isLoading ? (
                  <Loading type={'inline'} />
                ) : (
                  <div className='row project-items justify-content-center project-style-one'>
                    {projects.slice(0, 6).map((project) => (
                      <ProjectCard project={project} key={project.id} />
                    ))}
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
          <div className='col-12'>
            <div className='view-more-btn text-center mt-40'>
              <Link to='#'>
                <a className='main-btn bordered-btn'>
                  View More Projects <i className='far fa-arrow-right' />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default LatestProject
