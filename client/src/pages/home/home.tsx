// @ts-ignore

import { useEffect, useState } from 'react'
import main8 from '../../assets/images/home/main_image/1.png'
import v1 from '../../assets/images/home/main_image/Vector1.png'
import v2 from '../../assets/images/home/main_image/Vector2.png'

import Rectangle from '../../assets/images/home/main_image/Rectangle.png'

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
        <br />
        <br /> <br /> <br />
        <br />
        <br />
        <section className='d-flex justify-content-center align-items-center'>
          <div className=''>
            <div style={{ width: '60vw' }}>
              <h2
                className='title'
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '40px',
                  color: '#34A853'
                }}
              >
                Make Every Donation Count, Support Life-Changing Projects And
                Make a Difference.
              </h2>
            </div>
          </div>
        </section>
        <section className='mt-2 d-flex justify-content-center align-items-center'>
          <div className=''>
            <div style={{ width: '50vw' }}>
              <h6
                className='title mt-2 mb-4'
                style={{
                  textAlign: 'center',
                  // fontWeight: '700',
                  fontSize: '18px'
                }}
              >
                Join a global community that connects donors, NGO’s, &
                beneficiaries to create real impact. Fund meaningful projects,
                support verified NGO’s, & ensure donation reaches those who need
                it .
              </h6>
            </div>
          </div>
        </section>
        <section className='mt-3 d-flex justify-content-center align-items-center'>
          <div className=''>
            <div>
              <div>
                <a
                  href='/auth/register'
                  className='mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                  style={{ backgroundColor: '#F3FAF5', color: '#34A853' }}
                >
                  Create Project
                </a>
                <a
                  href='/latest-projects'
                  className='ml-4 mr-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                >
                  Explore Project
                  {/* <i className='far fa-arrow-right' /> */}
                </a>
                <a
                  href='/auth/register'
                  className='ml-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                  style={{ backgroundColor: '#F3FAF5', color: '#34A853' }}
                >
                  Join as an Organization
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className='mt-5 about-form-area'>
          <div className='container'>
            <div className='about-donation-form'>
              <img src={Rectangle} alt='' />
            </div>
          </div>
        </div>
        <section
          style={{ paddingBottom: '60px' }}
          className='feature-section feature-section-one section-gap'
        >
          <div className='container'>
            <div className='row justify-content-lg-between justify-content-center align-items-center'>
              <div className='col-xl-6 col-lg-7 col-md-10 col-sm-12'>
                <div className='feature-content'>
                  <div className='common-heading mb-3'>
                    <h3
                      style={{
                        width: 'max-content',
                        fontWeight: '600',
                        fontSize: '35px'
                      }}
                      className=''
                    >
                      About Us At GivingBack
                    </h3>
                  </div>
                  {/* Fancy Icon List */}
                  <div className='fancy-icon-list'>
                    <div className='fancy-list-item'>
                      <div className='contentT'>
                        <p
                          style={{
                            fontWeight: '300',
                            color: 'black'
                          }}
                        >
                          Due to unclear and non-insightful reports, donors
                          struggle to articulate the effectiveness and impact
                          (Stanford Social Innovation). This means that
                          beneficiaries may also not enjoy the full benefits
                          intended for them.
                        </p>
                      </div>
                    </div>
                    <div className='fancy-list-item'>
                      <p
                        style={{
                          fontWeight: '300',
                          color: 'black'
                        }}
                      >
                        At GivingBack, we are set to address this problem by
                        leveraging technology. We are a platform that enables
                        real-time collaboration among charity project
                        stakeholders.
                      </p>
                    </div>

                    <div className='fancy-list-item'>
                      <p
                        style={{
                          fontWeight: '300',
                          color: 'black'
                        }}
                      >
                        Our purpose is to optimize return on investment (ROI)
                        and impact on CSR/philanthropic investment.
                      </p>
                    </div>
                    <div className='fancy-list-item'>
                      <div
                        style={{ width: '-webkit-fill-available' }}
                        className='row justify-content-lg-between justify-content-center align-items-center'
                      >
                        <div className='col-xl-6 col-lg-7 col-md-10 col-sm-12'>
                          <div className='feature-content'>
                            {/* Fancy Icon List */}
                            <div className='fancy-icon-list'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                className='fancy-list-item'
                              >
                                <p
                                  style={{
                                    fontWeight: '600',
                                    color: '#34A853'
                                  }}
                                >
                                  5,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: '500',
                                    color: 'black'
                                  }}
                                >
                                  Projects Completed
                                </p>
                                <p
                                  style={{
                                    fontWeight: '300',
                                    color: 'black'
                                  }}
                                >
                                  Reported by NGOs/NFPOs
                                </p>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                className='fancy-list-item'
                              >
                                <p
                                  style={{
                                    fontWeight: '600',
                                    color: '#34A853'
                                  }}
                                >
                                  120,000,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: '500',
                                    color: 'black'
                                  }}
                                >
                                  Beneficiaries Impacted
                                </p>
                                <p
                                  style={{
                                    fontWeight: '300',
                                    color: 'black'
                                  }}
                                >
                                  From projects listed on this platform
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-6 col-md-9'>
                          <div className='feature-content'>
                            {/* Fancy Icon List */}
                            <div className='fancy-icon-list'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                className='fancy-list-item'
                              >
                                <p
                                  style={{
                                    fontWeight: '600',
                                    color: '#34A853'
                                  }}
                                >
                                  1,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: '500',
                                    color: 'black'
                                  }}
                                >
                                  NGOs/NFPOs
                                </p>
                                <p
                                  style={{
                                    fontWeight: '300',
                                    color: 'black'
                                  }}
                                >
                                  Across all geopolitical zones
                                </p>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                className='fancy-list-item'
                              >
                                <p
                                  style={{
                                    fontWeight: '600',
                                    color: '#34A853'
                                  }}
                                >
                                  10+
                                </p>
                                <p
                                  style={{
                                    fontWeight: '500',
                                    color: 'black'
                                  }}
                                >
                                  Industry Partners
                                </p>
                                <p
                                  style={{
                                    fontWeight: '300',
                                    color: 'black'
                                  }}
                                >
                                  Multi-sectoral and global trusted partners
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='fancy-list-item'>
                      <a
                        href='/about'
                        style={{ width: '40vw' }}
                        className='mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-9'>
                <div className=''>
                  <img src={main8} alt='Image' />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='d-flex justify-content-center align-items-center'>
          <div className=''>
            <div style={{ width: '60vw' }}>
              <h2
                className='title'
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '35px',
                  color: 'black'
                }}
              >
                The 4-Fold Problems We Are Solving
              </h2>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: '60px', paddingTop: '30px' }}
          className='feature-section feature-section-one '
        >
          <div className='container'>
            <div className='row justify-content-lg-between justify-content-center align-items-center'>
              <div className='col-xl-6 col-lg-7 col-md-10 col-sm-12'>
                <div
                  style={{ background: '#EDF7ED', borderRadius: '13px' }}
                  className='feature-content'
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: '25px' }} className='fancy-icon-list'>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      className='fancy-list-item'
                    >
                      <p
                        style={{
                          fontWeight: '600',
                          color: 'black'
                        }}
                      >
                        Bringing Trust & Transparency to Giving
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: 'black'
                        }}
                      >
                        Donors struggle with transparency, project verification,
                        & NGO credibility. We bridge the gap by ensuring
                        clarity, accountability, and trust in every donation.
                      </p>
                      <p
                        style={{
                          fontWeight: '500',
                          color: '#218025',
                          textDecoration: 'underline'
                        }}
                      >
                        Would you like to donate? Get started
                      </p>
                    </div>
                    <div
                      style={{ display: 'flex', justifyContent: 'center' }}
                      className='fancy-list-item'
                    >
                      <img className='p-3' src={v1} alt='Icon' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-9'>
                <div
                  style={{ background: '#F5E9F7', borderRadius: '13px' }}
                  className='feature-content'
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: '25px' }} className='fancy-icon-list'>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      className='fancy-list-item'
                    >
                      <p
                        style={{
                          fontWeight: '600',
                          color: 'black'
                        }}
                      >
                        Empowering Beneficiaries{' '}
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: 'black'
                        }}
                      >
                        Beneficiaries often lack a voice in project execution,
                        making it hard to validate impact or fully enjoy
                        intended benefits. We ensure they’re included, heard,
                        and supported.{' '}
                      </p>
                    </div>
                    <div
                      style={{ display: 'flex', justifyContent: 'center' }}
                      className='fancy-list-item'
                    >
                      <img className='p-4' src={v2} alt='Icon' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default Index
