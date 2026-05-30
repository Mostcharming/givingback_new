import { Link } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../services/capitalize'
import Util from '../../services/utils'

interface ProjectCardProps {
  project: any
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Function to determine status background color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brief':
        return '#c9c91f'
      case 'active':
        return 'green'
      case 'unverified':
        return 'grey'
      default:
        return 'black'
    }
  }

  return (
    <>
      <div className='col-lg-4 col-md-6 col-sm-10'>
        <div className='project-item mt-30'>
          <div
            className='thumb'
            style={{
              backgroundImage:
                project?.projectImages && project?.projectImages.length
                  ? `url(${project?.projectImages[0].image})`
                  : 'url(assets/images/project/project-1.jpg)'
            }}
          />
          <div className='contentT'>
            <div className='cats'>
              <Link to='/latest-projects'>{project.category}</Link>
            </div>
            <div className='info-row'>
              <h5 className='title'>
                <Link to={`/project-details?id=${project.id}`} state={project}>
                  <a>{project.title}</a>
                </Link>
              </h5>
              <div className='status-container'>
                <div
                  className='project-type'
                  style={{ backgroundColor: 'green' }}
                >
                  {/* <span className="dot" style={{ backgroundColor: "green" }}></span> */}
                  {/* {capitalizeFirstLetter(project.projectType)} */}
                  {project.projectType}
                </div>
                <div
                  className='status'
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {/* <span className="dot" style={{ backgroundColor: getStatusColor(project.status) }}></span> */}
                  {capitalizeFirstLetter(project.status)}
                </div>
              </div>
            </div>
            <div className='author'>
              {project?.projectType ? (
                <Link
                  to={`/project-details?id=${project.id}&projectType=${project.projectType}`}
                  state={project}
                >
                  Donor:{' '}
                  {project?.sponsors && project?.sponsors.length
                    ? project.sponsors[0].name
                    : project?.donor
                    ? project.donor.name
                    : ''}
                </Link>
              ) : (
                <span>
                  Donor:{' '}
                  {project?.sponsors && project?.sponsors.length
                    ? project.sponsors[0].name
                    : project?.donor
                    ? project.donor.name
                    : ''}
                </span>
              )}
            </div>

            <span className='date'>
              <i className='far fa-calendar-alt' />{' '}
              {Util.formatDate(project.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
