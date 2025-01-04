import { Link } from 'react-router-dom'
import main7 from '../../assets/images/home/main_image/main7.jpeg'

export default function BlogCard() {
  return (
    <>
      <div
        className='col-lg-4 col-md-6 col-sm-9 col-11 wow fadeInUp'
        data-wow-delay='0.1s'
      >
        <div className='latest-post-box mt-30'>
          <div className='post-thumb'>
            <img src={main7} alt='Image' />
          </div>
          <div className='post-content'>
            <a href='#' className='post-date'>
              <i className='far fa-calendar-alt' /> 25 February 2021
            </a>
            <h6 className='title'>
              <Link to='/news-details'>
                <a>Standing Out From Crowds mproving Mobile Experience</a>
              </Link>
            </h6>
            <Link to='/news-details'>
              <a className='post-link'>
                Read More <i className='far fa-arrow-right' />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const DUMMY_ARRAY2 = [1, 2, 3]
