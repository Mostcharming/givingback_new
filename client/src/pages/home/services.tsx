import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import { useLoadStyles } from '../../services/styles'

import aboutImage from '../../assets/images/home/new/about.png'
import fifthImage from '../../assets/images/home/new/fifth.png'
import fourthImage from '../../assets/images/home/new/fourth.png'
import secondImage from '../../assets/images/home/new/second.png'
import sixthImage from '../../assets/images/home/new/sixth.png'
import thirdImage from '../../assets/images/home/new/third.png'
const sections = [
  {
    heading:
      'Collaborate with Project Executors, Stakeholders, and Beneficiaries',
    content: `Empower your projects with seamless communication and coordination. GivingBack offers in-app messaging and integrated planning tools to facilitate real-time collaboration among donors, NGOs, beneficiaries, and other stakeholders. Ensure every voice is heard, every concern is addressed, and every project milestone is achieved together.`,
    list: [
      'Instant messaging and notifications for updates',
      'Real-time planning and task assignment',
      'Innovation',
      'Collaborative spaces to track project progress'
    ],
    image: aboutImage,
    gradientDirection: 'to left',
    imageOn: 'right'
  },
  {
    heading:
      'Aggregate and Manage All CSR Projects/Portfolios from a Central Point',
    content: `Simplify the management of your Corporate Social Responsibility (CSR) projects. GivingBack provides a unified platform to oversee all your charitable initiatives in one place, ensuring transparency, accountability, and effective resource allocation.`,
    list: [
      'Centralized dashboard for all projects',
      'Easy project tracking and updates',
      'Portfolio management with clear visibility on outcomes'
    ],
    image: secondImage,
    gradientDirection: 'to right',
    imageOn: 'left'
  },
  {
    heading:
      'Directory Service and Enhanced Search for Charity Projects, NGOs, and NFPOs',
    content: `Discover accredited NGOs and nonprofit organizations (NFPOs) effortlessly. GivingBack’s directory service features powerful search capabilities to connect you with trustworthy partners for your philanthropic goals. Make informed decisions by accessing detailed profiles and success stories.`,
    list: [
      'Comprehensive NGO directory with filters',
      'Verified profiles and project histories',
      'Enhanced search for specific project needs'
    ],
    image: thirdImage,
    gradientDirection: 'to left',
    imageOn: 'right'
  },
  {
    heading: 'Dedicated Landing Page and Customized URLs for NGOs',
    content: `Boost your visibility with a personalized online presence. GivingBack offers dedicated landing pages with custom URLs for NGOs to showcase their projects, share updates, and engage with donors directly. Enhance your reach and build stronger donor relationships.`,
    list: [
      'Customized web pages for NGOs',
      'Dynamic content updates and project showcases',
      'Unique URLs for easy sharing and branding'
    ],
    image: fourthImage,
    gradientDirection: 'to right',
    imageOn: 'left'
  },
  {
    heading: 'Access to Dashboards and Real-Time Reports & Analytics',
    content: `Maximize your impact with data-driven insights. With GivingBack’s analytics dashboard, you can generate real-time reports to measure project performance, assess ROI, and analyze the social impact of your investments.`,
    list: [
      'Customizable dashboards for performance tracking',
      'Real-time reporting and data visualization',
      'Impact assessment tools for better decision-making'
    ],
    image: fifthImage,
    gradientDirection: 'to left',
    imageOn: 'right'
  },
  {
    heading: 'Fund Management: Fund, Dispense, and Report',
    content: `Ensure your funds reach the right hands with GivingBack’s secure fund management system. From initial funding to final reporting, we streamline the entire process, offering transparency and trust at every step.`,
    list: [
      'Secure fund disbursement tools',
      'Automated reporting on fund utilization',
      'Full audit trail for accountability'
    ],
    image: sixthImage,
    gradientDirection: 'to right',
    imageOn: 'left'
  }
]

// const sections = [
//   {
//     heading:
//       'Collaborate with Project Executors, Stakeholders, and Beneficiaries',
//     content: `Empower your projects with seamless communication and coordination. GivingBack offers in-app messaging and integrated planning tools to facilitate real-time collaboration among donors, NGOs, beneficiaries, and other stakeholders. Ensure every voice is heard, every concern is addressed, and every project milestone is achieved together.`,
//     list: [
//       'Instant messaging and notifications for updates',
//       'Real-time planning and task assignment',
//       'Innovation',
//       'Collaborative spaces to track project progress'
//     ],
//     image: '/src/assets/images/home/new/about.png',
//     gradientDirection: 'to left',
//     imageOn: 'right'
//   },
//   {
//     heading:
//       'Aggregate and Manage All CSR Projects/Portfolios from a Central Point',
//     content: `Simplify the management of your Corporate Social Responsibility (CSR) projects. GivingBack provides a unified platform to oversee all your charitable initiatives in one place, ensuring transparency, accountability, and effective resource allocation.`,
//     list: [
//       'Centralized dashboard for all projects',
//       'Easy project tracking and updates',
//       'Portfolio management with clear visibility on outcomes'
//     ],
//     image: '/src/assets/images/home/new/second.png',
//     gradientDirection: 'to right',
//     imageOn: 'left'
//   },
//   {
//     heading:
//       'Directory Service and Enhanced Search for Charity Projects, NGOs, and NFPOs',
//     content: `Discover accredited NGOs and nonprofit organizations (NFPOs) effortlessly. GivingBack’s directory service features powerful search capabilities to connect you with trustworthy partners for your philanthropic goals. Make informed decisions by accessing detailed profiles and success stories.`,
//     list: [
//       'Comprehensive NGO directory with filters',
//       'Verified profiles and project histories',
//       'Enhanced search for specific project needs'
//     ],
//     image: '/src/assets/images/home/new/third.png',
//     gradientDirection: 'to left',
//     imageOn: 'right'
//   },
//   {
//     heading: 'Dedicated Landing Page and Customized URLs for NGOs',
//     content: `Boost your visibility with a personalized online presence. GivingBack offers dedicated landing pages with custom URLs for NGOs to showcase their projects, share updates, and engage with donors directly. Enhance your reach and build stronger donor relationships.`,
//     list: [
//       'Customized web pages for NGOs',
//       'Dynamic content updates and project showcases',
//       'Unique URLs for easy sharing and branding'
//     ],
//     image: '/src/assets/images/home/new/fourth.png',
//     gradientDirection: 'to right',
//     imageOn: 'left'
//   },
//   {
//     heading: 'Access to Dashboards and Real-Time Reports & Analytics',
//     content: `Maximize your impact with data-driven insights. With GivingBack’s analytics dashboard, you can generate real-time reports to measure project performance, assess ROI, and analyze the social impact of your investments.`,
//     list: [
//       'Customizable dashboards for performance tracking',
//       'Real-time reporting and data visualization',
//       'Impact assessment tools for better decision-making'
//     ],
//     image: '/src/assets/images/home/new/fifth.png',
//     gradientDirection: 'to left',
//     imageOn: 'right'
//   },
//   {
//     heading: 'Fund Management: Fund, Dispense, and Report',
//     content: `Ensure your funds reach the right hands with GivingBack’s secure fund management system. From initial funding to final reporting, we streamline the entire process, offering transparency and trust at every step.`,
//     list: [
//       'Secure fund disbursement tools',
//       'Automated reporting on fund utilization',
//       'Full audit trail for accountability'
//     ],
//     image: '/src/assets/images/home/new/sixth.png',
//     gradientDirection: 'to right',
//     imageOn: 'left'
//   }
// ]

const Services = () => {
  useLoadStyles(['givingback'])

  return (
    <Layout>
      <PageBanner pageName='Our Offerings' />
      <section className='contact-section section-gap-extra-bottom'>
        <div className='container'>
          <span
            className='col-md-6'
            style={{ fontSize: '18px', marginBottom: '10px' }}
          >
            Due to unclear and non-insightful reports, donors struggle to
            articulate the effectiveness and impact (Stanford Social
            Innovation). At GivingBack, this means that beneficiaries may also
            not enjoy the full benefits intended for them.
          </span>
          <hr
            style={{
              borderTop: '2px solid black',
              width: '100%',
              margin: '0 auto'
            }}
          />

          {sections.map((section, index) => (
            <div
              key={index}
              className='row align-items-center justify-content-center pt-3'
            >
              {section.imageOn === 'left' && (
                <div
                  style={{
                    background: `linear-gradient(${section.gradientDirection}, #CCFFDE5C, white)`
                  }}
                  className='col-md-6 col-sm-10 p-5'
                >
                  <img src={section.image} alt={section.heading} />
                </div>
              )}
              <div className='col-md-6 col-sm-10 p-5'>
                <br />
                <p style={{ fontSize: '18px' }}>
                  <span style={{ color: 'black', fontWeight: 'bold' }}>
                    {section.heading}:{' '}
                  </span>
                  <br />
                  {section.content}
                </p>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: 'black',
                    fontWeight: 'bold'
                  }}
                >
                  Key Features:
                </span>
                <ul
                  style={{
                    fontSize: '18px',
                    listStyleType: 'disc',
                    paddingLeft: '20px'
                  }}
                >
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              {section.imageOn === 'right' && (
                <div
                  style={{
                    background: `linear-gradient(${section.gradientDirection}, #CCFFDE5C, white)`
                  }}
                  className='col-md-6 col-sm-10 p-5'
                >
                  <img src={section.image} alt={section.heading} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default Services
