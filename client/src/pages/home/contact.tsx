import React, { useState } from 'react'
import { toast } from 'react-toastify'
import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import useBackendService from '../../services/backend_service'
import { useLoadStyles } from '../../services/styles'

const Contact = () => {
  useLoadStyles(['givingback'])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const sendContactForm = useBackendService('/send_email', 'POST', {
    onSuccess: () => {
      toast.success('Message sent successfully!')
      setIsSubmitting(false)
      resetForm()
    },
    onError: () => {
      toast.error('Failed to send message. Please try again later.')
      setIsSubmitting(false)
    }
  }).mutate

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: ''
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, phoneNumber, subject, message } = formData
    if (!name || !email || !phoneNumber || !subject || !message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    sendContactForm(formData)
  }

  return (
    <Layout>
      <PageBanner pageName='Contact Us' />
      <section className='contact-section section-gap-extra-bottom'>
        <div className='container'>
          {/* Contact Info Start */}
          <div className='row align-items-center justify-content-center'>
            <div className='col-lx-4 col-lg-5 col-sm-10'>
              <div className='contact-info-text mb-md-70'>
                <div className='common-heading mb-30'>
                  <span className='tagline'>
                    <i className='fas fa-plus' /> Donate Projects
                    <span className='heading-shadow-text'>Donate</span>
                  </span>
                  <h2 className='title'>Ready to Get More Information</h2>
                </div>
                <p style={{ fontSize: '18px' }}>
                  We would like to hear from you. Please feel free to reach out
                  to us through any of our channels displayed on this page.
                </p>
              </div>
            </div>
            <div className='col-xl-6 col-lg-7 offset-xl-1'>
              <div className='contact-info-boxes'>
                <div className='row justify-content-center align-items-center'>
                  <div className='col-md-6 col-sm-10'>
                    <div
                      className='info-box text-center wow fadeInUp'
                      data-wow-delay='0.2s'
                    >
                      <div className='icon'>
                        <i className='flaticon-place' />
                      </div>
                      <div className='info-content'>
                        <h5>Our Location</h5>
                        <p>Muliner Towers, Alfred Rewane Rd. Ikoyi, Lagos</p>
                      </div>
                    </div>
                    <div
                      className='info-box text-center mt-30 mb-sm-30 wow fadeInUp'
                      data-wow-delay='0.3s'
                    >
                      <div className='icon'>
                        <i className='flaticon-envelope' />
                      </div>
                      <div className='info-content'>
                        <h5>Email Address</h5>
                        <p>
                          info@givingbackng.org <br />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-sm-10'>
                    <div
                      className='info-box text-center wow fadeInUp'
                      data-wow-delay='0.3s'
                    >
                      <div className='icon'>
                        <i className='flaticon-phone-call-1' />
                      </div>
                      <div className='info-content'>
                        <h5>Support 24/7</h5>
                        <p>
                          +234 908 549 4236 <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Info End */}
          <div className='contact-from-area'>
            <div className='row no-gutters'>
              <div className='col-lg-5'>
                <div className='contact-maps'>
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.1601330895098!2d3.4285836421849916!3d6.451648350052111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjcnMDUuOSJOIDPCsDI1JzQzLjAiRQ!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng&z=15&markers=color:red%7Clabel:P%7C6.451648350052111,3.4285836421849916`}
                    width='100%'
                    height='450'
                    allowFullScreen={false}
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  />
                </div>
              </div>
              <div className='col-lg-7'>
                <div className='contact-form'>
                  <form onSubmit={handleSubmit}>
                    <h3 className='form-title'>Send Us Message</h3>
                    <div className='row'>
                      <div className='col-lg-6'>
                        <div className='form-field mb-25'>
                          <label htmlFor='name'>Your Name</label>
                          <input
                            type='text'
                            id='name'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='Your Name'
                          />
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form-field mb-25'>
                          <label htmlFor='phoneNumber'>Phone Number</label>
                          <input
                            type='text'
                            id='phoneNumber'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder='Your Phone Number'
                          />
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form-field mb-25'>
                          <label htmlFor='email'>Email Address</label>
                          <input
                            type='email'
                            id='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Your Email'
                          />
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form-field mb-25'>
                          <label htmlFor='subject'>Subject</label>
                          <input
                            type='text'
                            id='subject'
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder='Subject'
                          />
                        </div>
                      </div>
                      <div className='col-12'>
                        <div className='form-field mb-30'>
                          <label htmlFor='message'>Write Message</label>
                          <textarea
                            id='message'
                            value={formData.message}
                            onChange={handleChange}
                            placeholder='Your Message'
                          />
                        </div>
                      </div>
                      <div className='col-12'>
                        <div className='form-field'>
                          <button
                            className='main-btn'
                            type='submit'
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span
                                className='spinner-border spinner-border-sm'
                                role='status'
                                aria-hidden='true'
                              ></span>
                            ) : (
                              <>
                                Send Us Message{' '}
                                <i className='far fa-arrow-right' />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Contact
