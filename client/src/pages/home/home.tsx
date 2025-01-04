// @ts-ignore

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import main2 from '../../assets/images/home/avatar.svg'
import main3 from '../../assets/images/home/main_image/main3.jpeg'
import main4 from '../../assets/images/home/main_image/main4.jpeg'
import main5 from '../../assets/images/home/main_image/main5.jpeg'
import main8 from '../../assets/images/home/main_image/main8.png'

import BlogCard, { DUMMY_ARRAY2 } from '../../components/home/blog-card'
import Counter from '../../components/home/Counter'
import { imageTextBlockSlider } from '../../components/home/sliderProps'
import VideoPopup from '../../components/home/VideoPopup'
import ProjectCard from '../../components/projects/project-card'
import Layout from '../../layouts/home'
import useBackendService from '../../services/backend_service'
import { useLoadStyles } from '../../services/styles'
const Index = () => {
  useLoadStyles(['givingback'])
  // const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)

  const [projects, setProjects] = useState<any[]>([])

  const getAllProjects = useBackendService('/allprojects', 'GET', {
    onSuccess: (res: any) => {
      setProjects(res.projects)
    },
    onError: () => {}
  }).mutate

  useEffect(() => {
    getAllProjects({ page: 1, limit: 3, projectType: 'present' })
  }, [setProjects])

  const [video, setVideo] = useState(false)
  return (
    <>
      <Layout transparentHeader topSecondaryBg>
        {video && <VideoPopup close={setVideo} />}
        <section className='hero-area-two'>
          <div className='container'>
            <div className='row align-items-center'>
              <div className='col-lg-6 col-md-8 col-sm-11'>
                <div className='hero-text'>
                  <h2
                    style={{ fontSize: '45px' }}
                    className='title wow fadeInLeft'
                    data-wow-delay='0.2s'
                  >
                    We help Donors optimize ROI and impact on philanthropic
                    investment
                  </h2>
                  <p className='wow fadeInLeft' data-wow-delay='0.3s'>
                    Experience the power of transparency, collaboration,
                    <br />
                    monitoring and evaluation
                  </p>
                  <ul className='hero-btn'>
                    <li className='wow fadeInUp' data-wow-delay='0.4s'>
                      <Link to='/latest-projects'>
                        <a className='main-btn'>
                          Explore Projects <i className='far fa-arrow-right' />
                        </a>
                      </Link>
                    </li>
                    <li className='wow fadeInUp' data-wow-delay='0.5s'>
                      <a
                        href='#'
                        className='video-btn'
                        onClick={() => setVideo(true)}
                      >
                        <i className='fas fa-play' />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='col-lg-6 col-md-8 col-sm-10 mx-auto wow fadeInRight'
                data-wow-delay='0.2s'
              >
                <div className='hero-img text-lg-right'>
                  <img src={main4} alt='Hero-Img' />
                </div>
              </div>
            </div>
          </div>
          <div className='hero-shapes'>
            <div className='dot-one' />
            <div className='dot-two' />
          </div>
        </section>
        {/*====== Hero Area End ======*/}
        {/*====== About Section Start ======*/}
        <section className='about-section-two'>
          <div className='about-form-area'>
            <div className='container'>
              <div className='about-donation-form'>
                <div className='donation-heading'>
                  <h3 className='text-white'>
                    <span style={{ fontWeight: 'normal', fontSize: '20px' }}>
                      The World needs more goodness.
                    </span>
                    <br />
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '45px',
                        width: '50vw'
                      }}
                    >
                      Fund a project today!
                    </span>
                  </h3>
                  <span className='shadow-text'>Support</span>
                </div>
                <form onSubmit={(e) => e.preventDefault()} action='#'>
                  <div className='form-wrap'>
                    <ul className=''>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                    <button
                      type='submit'
                      className='main-btn btn-white'
                      // onClick={() => setIsDonateModalOpen(true)}
                    >
                      Donate Now <i className='far fa-arrow-right' />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='about-text-area'>
            <div className='container'>
              <div className='row align-items-end justify-content-xl-start'>
                <div className='col-xl-5 col-lg-7 col-md-8 order-xl-2'>
                  <div className='about-text'>
                    <div className='common-heading mb-30'>
                      <span className='tagline'>
                        <i className='fas fa-plus' /> About us
                        <span className='heading-shadow-text'>About Us</span>
                      </span>
                      <h2 className='title'>
                        Seamlessly harmonize and manage all your charity
                        projects from one point.
                      </h2>
                    </div>
                    <p>
                      Whether you're a nonprofit, CSR team, or an individual
                      with a passion for change in creating a better world. We
                      help Donors optimize Return on Investment (ROI) and impact
                      from CSR/ philanthropic investment in the following ways:
                    </p>
                    <ul className='' style={{ padding: '10px' }}>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Aggregate all your CSR Project into one place
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Centralized CSR portfolio management
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Realtime collaboration with all stakeholders
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Realtime stakeholder engagements
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Access to partners' directories
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Generate real-time reports and Analytics
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Personally manage your project fund
                      </li>
                      <li
                      // className='col-md-6 mb-2'
                      >
                        • Enhance your visibility and showcase your projects
                      </li>
                    </ul>

                    <ul className='check-list mt-30'>
                      <li>
                        <h5 className='title'>
                          Optimize your philanthropic investment ROI
                        </h5>
                        <p>
                          Maximize impact, minimize waste, and optimize your
                          return on investment.
                        </p>
                      </li>
                      <li>
                        <h5 className='title'>Highest success impact rate</h5>
                        <p>
                          Make every of your dollar count towards the intended
                          impact
                        </p>
                      </li>
                      <li>
                        <h5 className='title'>
                          Receive feedback from the beneficiaries
                        </h5>
                        <p>
                          See, hear and feel the impact of your projects
                          directly from your beneficiaries
                        </p>
                      </li>
                    </ul>
                    <Link to='/#'>
                      <a className='main-btn btn-dark mt-40'>
                        Learn More <i className='far fa-arrow-right' />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className='col-xl-5 order-xl-1 wow fadeInUp'>
                  <div
                    className='about-curved-img'
                    style={{ marginBottom: '200px' }}
                  >
                    <img src={main3} alt='Image' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='about-shape'>
            {/* <img src='assets/img/about/about-shape.png' alt='Shape' /> */}
          </div>
        </section>
        {/*====== About Section End ======*/}
        {/*====== Project Section Start ======*/}
        <section className='project-section project-section-two'>
          <div className='container fluid-extra-padding'>
            <div className='common-heading text-center color-version-white mb-30'>
              <span className='tagline'>
                <i className='fas fa-plus' /> Popular Projects
                <span className='heading-shadow-text'>Our Projects</span>
              </span>
              <h2 className='title'>Ongoing Projects</h2>
            </div>
            <div className='row justify-content-center project-items project-style-one'>
              {projects.slice(0, 3).map((project) => {
                return <ProjectCard project={project} />
              })}
            </div>
          </div>
        </section>
        {/*====== Project Section End ======*/}
        {/*====== Feature Section Start ======*/}
        <section className='feature-section feature-section-one section-gap'>
          <div className='container'>
            <div className='row justify-content-lg-between justify-content-center align-items-center'>
              <div className='col-xl-4 col-lg-5 col-md-8 col-sm-10'>
                <div className='feature-content mb-md-50'>
                  <div className='common-heading mb-45'>
                    <span className='tagline'>
                      <i className='fas fa-plus' /> What we do
                      <span className='heading-shadow-text'>Features</span>
                    </span>
                    <h2 className='title'>Why Choose us</h2>
                  </div>
                  {/* Fancy Icon List */}
                  <div className='fancy-icon-list'>
                    <div className='fancy-list-item'>
                      <div className='icon'>
                        <i className='fas fa-users' />
                      </div>
                      <div className='contentT'>
                        <h4 className='title'>Community Focused</h4>
                        <p>
                          Receive live reports from the NGOs implementing your
                          project.
                        </p>
                      </div>
                    </div>
                    <div className='fancy-list-item'>
                      <div className='icon'>
                        <i className='fas fa-handshake' />
                      </div>
                      <div className='contentT'>
                        <h4 className='title'>
                          Collaboration and Transparency
                        </h4>
                        <p>
                          See, hear and feel the impact of your projects
                          directly from your beneficiaries and stakeholders.
                        </p>
                      </div>
                    </div>
                    <div className='fancy-list-item'>
                      <div className='icon'>
                        <i className='fas fa-chart-line' />
                      </div>
                      <div className='contentT'>
                        <h4 className='title'>
                          Realtime Reporting and Insights
                        </h4>
                        <p>
                          Receive live reports from your field and project
                          managers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-7 col-md-10'>
                <div className=''>
                  <img src={main8} alt='Image' />
                  {/* <a
                    href="#"
                    className="video-popup"
                    onClick={() => setVideo(true)}
                  >
                    <i className="fas fa-play" />
                  </a> */}
                  {/* <img
                    src="/src/assets/images/home/main_image/main8.png"
                    alt="Image"
                    className="video-shape"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*====== Feature Section End ======*/}
        {/*====== Counter With Image Text Block Start ======*/}
        <section className='counter-with-image-text-block'>
          <div className='image-text-block-area'>
            <div className='container'>
              <Slider
                {...imageTextBlockSlider}
                className='image-text-block-slider'
              >
                <div className='single-slider'>
                  <div className='image-text-block text-block-one'>
                    <div className='block-img'>
                      <img src={main5} alt='Image' />
                    </div>
                    <div className='block-content'>
                      <div className='common-heading mb-40'>
                        <span className='tagline'>
                          <i className='fas fa-plus' /> top Funding stories
                          <span className='heading-shadow-text'>
                            Top Stories
                          </span>
                        </span>
                        <h2 className='title'>Meet William &amp; Michael</h2>
                      </div>
                      <p className='mb-30'>
                        William and Michael’s journey began with a simple
                        idea—to create a platform that brings communities
                        together. Through their project, they’ve been able to
                        transform lives and empower individuals to make
                        meaningful contributions to causes they care about.
                        Their story is one of resilience, passion, and making a
                        difference.
                      </p>
                      <p className='italic-text'>
                        "It's not just about the money; it's about the change
                        we're driving in our communities," says William. Their
                        efforts continue to inspire many.
                      </p>
                      <Link to='/services'>
                        <a className='main-btn bordered-btn mt-40'>
                          Learn More <i className='far fa-arrow-right' />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='single-slider'>
                  <div className='image-text-block text-block-one'>
                    <div className='block-img'>
                      <img src={main2} alt='Image' />
                    </div>
                    <div className='block-content'>
                      <div className='common-heading mb-40'>
                        <span className='tagline'>
                          <i className='fas fa-plus' /> Inspiring Funding
                          Stories
                          <span className='heading-shadow-text'>
                            Top Stories
                          </span>
                        </span>
                        <h2 className='title'>
                          A Journey of Hope &amp; Transformation
                        </h2>
                      </div>
                      <p className='mb-30'>
                        The project, started by local volunteers, has rapidly
                        gained support and is changing lives across the region.
                        By providing resources and education, they’ve helped
                        uplift entire communities, turning dreams into reality.
                        Their work is a testament to the power of collective
                        action.
                      </p>
                      <p className='italic-text'>
                        "Together, we are building a future where everyone has
                        the tools and support to succeed," one volunteer said.
                      </p>
                      <Link to='/latest-projects'>
                        <a className='main-btn bordered-btn mt-40'>
                          Learn More <i className='far fa-arrow-right' />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
          <div className='counter-boxes-area primary-soft-bg'>
            <div className='container'>
              <div className='row counter-boxes justify-content-lg-between justify-content-center'>
                <div className='col-xl-auto col-lg-3 col-md-6 col-sm-8'>
                  <div className='counter-box mb-60'>
                    <div className='icon'>
                      <i className='flaticon-crowdfunding' />
                    </div>
                    <div className='contentT'>
                      <div className='count-wrap'>
                        <Counter end={5000} />
                        <span className='suffix'>+</span>
                      </div>
                      <h6 className='title'>Projects Completed</h6>
                      <p>Reported by NGOs/NFPOs</p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-auto col-lg-3 col-md-6 col-sm-8'>
                  <div className='counter-box mb-60'>
                    <div className='icon'>
                      <i className='flaticon-ecological' />
                    </div>
                    <div className='contentT'>
                      <div className='count-wrap'>
                        <Counter end={1000} />
                        <span className='suffix'>+</span>
                      </div>
                      <h6 className='title'>NGOs/NFPOs</h6>
                      <p>Across all geopolitical zones</p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-auto col-lg-3 col-md-6 col-sm-8'>
                  <div className='counter-box mb-60'>
                    <div className='icon'>
                      <i className='flaticon-badges' />
                    </div>
                    <div className='contentT'>
                      <div className='count-wrap'>
                        <Counter end={120000000} />
                        <span className='suffix'>+</span>
                      </div>
                      <h6 className='title'>Beneficiaries impacted</h6>
                      <p>From projects listed on this platform</p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-auto col-lg-3 col-md-6 col-sm-8'>
                  <div className='counter-box mb-60'>
                    <div className='icon'>
                      <i className='flaticon-support' />
                    </div>
                    <div className='contentT'>
                      <div className='count-wrap'>
                        <Counter end={10} />
                        <span className='suffix'>+</span>
                      </div>
                      <h6 className='title'>Industry partners</h6>
                      <p>Multi-sectoral and global trusted partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*====== Counter With Image Text Block End ======*/}
        {/*====== Testimonials Start ======*/}
        <section className='testimonials-section section-gap'>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-xl-8 col-lg-10'>
                <div className='common-heading text-center mb-30'>
                  <span className='tagline'>
                    <i className='fas fa-plus' /> Client Feedback
                    <span className='heading-shadow-text'>Testimonials</span>
                  </span>
                  <h2 className='title'>{`What People Are Saying`}</h2>
                </div>
                <div className='testimonial-boxes'>
                  <div
                    className='testimonial-box-two mt-30 wow fadeInUp'
                    data-wow-delay='0s'
                  >
                    <div className='author-img'>
                      {/* <img src='assets/img/author-thumbs/07.png' alt='Thumb' /> */}
                    </div>
                    <div>
                      <p className='testimonial-desc'>
                        {`"GivingBack has completely transformed how we approach community support. With the help of donors from this platform, we've been able to provide school supplies for underprivileged children in Lagos. It's been a game-changer."`}
                      </p>
                      <div className='author-info'>
                        <h5 className='name'>Adetola O. Akinwale</h5>
                        <p className='position'>NGO Coordinator</p>
                      </div>
                    </div>
                    <div className='rating-wrap'>
                      <ul>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    className='testimonial-box-two mt-30 wow fadeInUp'
                    data-wow-delay='0.1s'
                  >
                    <div className='author-img'>
                      {/* <img src='assets/img/author-thumbs/08.png' alt='Thumb' /> */}
                    </div>
                    <div>
                      <p className='testimonial-desc'>
                        {`"Through this platform, we were able to gather the funds to set up a clean water project in my village. The impact has been life-changing, and the support we’ve received has been overwhelming. We can’t thank the donors enough."`}
                      </p>
                      <div className='author-info'>
                        <h5 className='name'>Ngozi I. Eze</h5>
                        <p className='position'>Community Leader</p>
                      </div>
                    </div>
                    <div className='rating-wrap'>
                      <ul>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    className='testimonial-box-two mt-30 wow fadeInUp'
                    data-wow-delay='0.2s'
                  >
                    <div className='author-img'>
                      {/* <img src='assets/img/author-thumbs/09.png' alt='Thumb' /> */}
                    </div>
                    <div>
                      <p className='testimonial-desc'>
                        {`"As a small business owner, I was struggling to find resources to expand my operations. Through GivingBack, I received donations that helped me scale my business and employ more people in my community. I’m forever grateful."`}
                      </p>
                      <div className='author-info'>
                        <h5 className='name'>Chinonso M. Olawale</h5>
                        <p className='position'>Entrepreneur</p>
                      </div>
                    </div>
                    <div className='rating-wrap'>
                      <ul>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                        <li>
                          <i className='fas fa-star' />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*====== Testimonials End ======*/}
        {/*====== Partners Section With CTA Start ======*/}
        <section className='partners-with-cta'>
          <div className='cta-boxes'>
            <div className='container'>
              <div className='row no-gutters justify-content-center'>
                <div className='col-lg-6 col-md-10'>
                  <div
                    className='cta-box cta-primary-overly'
                    // style={{ backgroundImage: 'url(assets/img/cta/02.jpg)' }}
                  >
                    <h2 className='cta-title'>Looking to fund a project?</h2>
                    <p>
                      Your contribution can bring hope and change lives. Help us
                      support those in need by funding a project that matters.
                    </p>
                    <Link to='/latest-projects'>
                      <a className='main-btn btn-white'>
                        Start GivingBack <i className='far fa-arrow-right' />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className='col-lg-6 col-md-10'>
                  <div
                    className='cta-box mt-40'
                    // style={{ backgroundImage: 'url(assets/img/cta/03.jpg)' }}
                  >
                    <h2 className='cta-title'>Enlist your project.</h2>
                    <p>
                      Have a project that can make a difference? Join us and
                      list your project to get the support it needs.
                    </p>
                    <Link to='/signup'>
                      <a className='main-btn'>
                        Start GivingBack <i className='far fa-arrow-right' />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='partners-logos'>
            <div className='container'>
              {/* <div className="row partners-logos-two">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/01.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/02.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/03.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/04.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/05.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/06.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/07.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="logo mb-30">
                    <Link to="/testimonial">
                      <a>
                        <img src="assets/img/partners/08.png" alt="Image" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        {/*====== Partners Section With CTA End ======*/}
        {/*====== Latest News Start ======*/}
        <section className='latest-blog-section section-gap-extra-bottom'>
          <div className='container'>
            <div className='common-heading text-center mb-30'>
              <span className='tagline'>
                <i className='fas fa-plus' /> Latest News &amp; Blog
                <span className='heading-shadow-text'>News Blog</span>
              </span>
              <h2 className='title'>Get Every Single Update</h2>
            </div>
            <div className='row justify-content-center latest-blog-posts style-two'>
              {DUMMY_ARRAY2.map((item) => {
                return <BlogCard />
              })}
            </div>
          </div>
        </section>
        {/*====== Latest News End ======*/}
        {/*====== Footer Start ======*/}
      </Layout>
      {/* <DonateModal
        open={isDonateModalOpen}
        handleClose={() => setIsDonateModalOpen(false)}
      /> */}
    </>
  )
}

export default Index
