import { useState } from 'react'
import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import { useLoadStyles } from '../../services/styles'

import aboutImage from '../../assets/images/home/new/about.png'
import madamImage from '../../assets/images/home/new/madam.jpeg'
import mayImage from '../../assets/images/home/new/may.jpeg'
import mrpelumiImage from '../../assets/images/home/new/mrpelumi.png'
import mrsamImage from '../../assets/images/home/new/mrsam.png'
import pastorImage from '../../assets/images/home/new/pastor.png'

const About = () => {
  useLoadStyles(['givingback'])

  const teamMembers = [
    {
      name: 'Olumide Ademidun',
      position: 'Platform Lead',
      linkedinLink: '#',
      image: pastorImage,
      bio: `Olumide Ademidun is the Chief Platform Officer for GivingBack® Organization. 
      A graduate of Computer Science from the University of Lagos and holder of an MBA in Strategic Management, 
      Olumide is a Certified Member of the Project Management Institute, North America (PMP), and a long-standing Fellow of the British Computer Society. 
      He has been part of several innovative start-up businesses both within and outside Nigeria. 
      Olumide is an active and vibrant founding member of various Nigerian-Canadian Business and Professional Groups, 
      dedicated to promoting Foreign Direct Investment to Nigeria and ensuring Transparency, Integrity, and Values are given the highest consideration in businesses. 
      He is currently a Board Member of Milton Community Services Advisory Committee and Milton Community Fund Committee and has a vast business interest in Nigeria.`
    },
    {
      name: 'Vivian Byron',
      position: 'Corporate & Legal Lead',
      linkedinLink: '#',
      image: madamImage,
      bio: `Attended the. Prestigious University of lfe as it then was .Now Obafemi Awolowo University (OAU).

Graduated with Llb hons in 1988 and conferred with Bachelor of Law in 1990
Amongst others she worked in the iconic law firm Irving and bonnar spanning   roughly a decade where she garnered. a wealth of.  experience practicing both corporate and advocate law in High proffle cases and. Corporate issues.
She became. a notary public in 2012

In 2021 she was conferred with the membership of the Nigerian institute of Chartered Arbitrator
Principal Partner Vivian Byron and co 
A successful law firm`
    },
    {
      name: 'Samuel Omotayo',
      position: 'Product & Business Development',
      linkedinLink: 'https://www.linkedin.com/in/omotayosamuel/',
      image: mrsamImage,
      bio: `Visionary product leader with 15+ years of experience delivering new-to-live and managing matured products in several industries such as banking, fintech, telecoms, and government in delivering impactful solutions and products. 
      Strong track record of bringing new products to life, including launching the first digital bank in West Africa, which now powers over 2MM+ financial transactions and 5MM API+ calls daily. 
      He recently managed and grew a product with over 65 million users covering 32 countries across the Caribbean islands, Latin America (LATAM), French West Indies and the Pacific region. 
      More so, his experience extends into the public sector, where he was responsible for the entire design of the GovTech platform, State Residents Identity Management System and Electronic Health Management System. 
      Similarly, he consulted for the Barbados Government in transforming ideas from the government-led hackathon to actual products. 
      He has supported many incubating start-ups and fintech on lean-agile product strategy as the Head of Innovation for Wema Bank after launching ALAT by Wema, Nigeria's first fully digital bank. 
      Before these roles, he worked with Etisalat, Yuuzoo (Singapore) and GTBank and consulted for West Africa's leading financial institutions - Zenith Bank, UBA and Access Bank in different capacities.`
    },
    {
      name: 'Akinpelumi Akinlolu',
      position: 'Advocacy Lead',
      linkedinLink: '#',
      image: mrpelumiImage,
      bio: 'Akinpelumi leads advocacy initiatives, engaging stakeholders for impact.'
    },
    {
      name: 'Fadeni Mayowa',
      position: 'Technology Lead',
      linkedinLink: 'https://www.linkedin.com/in/mayowaffredrick/',
      image: mayImage,
      bio: `Fadeni Mayowa is an experienced Technology Lead and full-stack developer with a strong focus on leveraging technology to solve real-world challenges. 
        With a background in computer science and over 5 years of professional experience, he has been pivotal in building scalable software solutions for various industries, including agriculture, fintech, and nonprofit organizations. 
        At GivingBack, Mayowa oversees the design, implementation, and optimization of the organization's technological infrastructure. 
        Beyond his technical expertise, Mayowa is deeply passionate about creating innovative solutions that foster transparency, efficiency, and impact. 
        As the Technology Lead, he is responsible for driving the vision and strategy of GivingBack's technology roadmap, ensuring the platform remains at the forefront of innovation in the philanthropic sector.
        Outside of work, Mayowa actively mentors young developers and contributes to open-source projects, demonstrating his commitment to the growth of the tech ecosystem. 
        His leadership style emphasizes collaboration, continuous learning, and staying adaptable in an ever-evolving industry.`
    }
  ]

  const [selectedMember, setSelectedMember] = useState(null)

  const TeamMember = ({ name, position, linkedinLink, image, onClick }) => (
    <div className='col-xl-3 col-md-6 mb-4 pt-4' onClick={onClick}>
      <div className='card border-0 shadow position-relative'>
        <img
          style={{
            paddingBottom: image === madamImage ? '58px' : '0'
          }}
          src={image}
          className='card-img-top'
          alt={name}
        />
        <div
          className='name-box position-absolute w-100'
          style={{
            bottom: '0',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 0'
          }}
        >
          <a
            href={linkedinLink}
            target='_blank'
            rel='noopener noreferrer'
            className='icon-overlay position-absolute'
            style={{
              top: '-20px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <svg
              width='54'
              height='54'
              viewBox='0 0 54 54'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='27'
                cy='27'
                r='25.5'
                fill='#F4FFDF'
                stroke='#8CBE27'
                strokeWidth='3'
              />
              <g clipPath='url(#clip0_1798_9412)'>
                <path
                  d='M20.5528 17.5714C20.5528 18.7552 19.6013 19.7143 18.427 19.7143C17.2528 19.7143 16.3013 18.7552 16.3013 17.5714C16.3013 16.3886 17.2528 15.4286 18.427 15.4286C19.6013 15.4286 20.5528 16.3886 20.5528 17.5714ZM20.5699 21.4286H16.2842V35.1429H20.5699V21.4286ZM27.4116 21.4286H23.1533V35.1429H27.4125V27.9437C27.4125 23.9409 32.5802 23.6134 32.5802 27.9437V35.1429H36.8556V26.4592C36.8556 19.7049 29.2082 19.9509 27.4116 23.2757V21.4286Z'
                  fill='#8CBE27'
                />
              </g>
              <defs>
                <clipPath id='clip0_1798_9412'>
                  <rect
                    width='20.5714'
                    height='20.5714'
                    fill='white'
                    transform='translate(16.2842 14.5714)'
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
          <h5 className='card-title mb-0 ml-2'>{name}</h5>
          <div className='card-text text-black-50 ml-2'>{position}</div>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <PageBanner pageName='About Us' />
      <section className='contact-section section-gap-extra-bottom'>
        <div className='container'>
          <div className='row align-items-center justify-content-center'>
            <div className='col-md-6 col-sm-10'>
              <p style={{ fontSize: '18px' }}>
                Due to unclear and non-insightful reports, donors struggle to
                articulate the effectiveness and impact (Stanford Social
                Innovation). At GivingBack, this means that beneficiaries may
                also not enjoy the full benefits intended for them.
              </p>
              <br />
              <p style={{ fontSize: '18px' }}>
                At GivingBack, we are set to address this problem by leveraging
                technology. We are a platform that enables real-time
                collaboration among charity project stakeholders.
              </p>
              <br />
              <p style={{ fontSize: '18px' }}>
                <span style={{ color: 'black', fontWeight: 'bold' }}>
                  Our Vision:
                </span>
              </p>
              <br />
              <p style={{ fontSize: '18px' }}>
                <span style={{ color: 'black', fontWeight: 'bold' }}>
                  Our Mission:
                </span>
              </p>
              <br />
              <p style={{ fontSize: '18px' }}>
                <span style={{ color: 'black', fontWeight: 'bold' }}>
                  Our Purpose:{' '}
                </span>{' '}
                To optimize Return on Investment (ROI) and impact on
                CSR/philanthropic investment.
              </p>
              <br />
              <span
                style={{ fontSize: '18px', color: 'black', fontWeight: 'bold' }}
              >
                Core Value:
              </span>
              <ul
                style={{
                  fontSize: '18px',
                  listStyleType: 'disc',
                  paddingLeft: '20px'
                }}
              >
                <li>Transparency</li>
                <li>Customer-Centricity</li>
                <li>Innovation</li>
                <li>Mutual Respect</li>
              </ul>
            </div>

            <div className='col-md-6 col-sm-10'>
              <img src={aboutImage} alt='hi' />
            </div>
          </div>

          <br />

          <div className='contact-from-area'>
            <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Our Team
            </h3>
            <hr
              style={{
                borderTop: '2px solid black',
                width: '100%',
                margin: '0 auto'
              }}
            />

            <div className='container'>
              <div className='row'>
                {teamMembers.map((member, index) => (
                  <TeamMember
                    key={index}
                    name={member.name}
                    position={member.position}
                    linkedinLink={member.linkedinLink}
                    image={member.image}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedMember && (
        <div className='modal'>
          <div className='modal-content'>
            <button
              className='close-btn'
              onClick={() => setSelectedMember(null)}
            >
              <svg
                width='28'
                height='28'
                viewBox='0 0 58 58'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8.49441 8.49427C-2.83147 19.8195 -2.83147 38.181 8.49441 49.5056C19.8196 60.8315 38.181 60.8315 49.5056 49.5056C60.8315 38.1803 60.8315 19.8189 49.5056 8.49362C38.1804 -2.83164 19.8196 -2.83099 8.49441 8.49427ZM47.3944 47.3943C37.2515 57.5372 20.7498 57.5372 10.6063 47.3943C0.464095 37.2515 0.464095 20.7497 10.6063 10.6062C20.7485 0.463935 37.2515 0.463935 47.3944 10.6062C57.5359 20.7484 57.5359 37.2515 47.3944 47.3943ZM20.5997 18.4877L18.4878 20.6002L26.8875 28.9999L18.4878 37.3996L20.5997 39.5121L29 31.1124L37.3996 39.5121L39.5128 37.3996L31.1125 28.9999L39.5122 20.5996L37.3996 18.4877L29 26.888L20.5997 18.4877Z'
                  fill='#239742'
                />
              </svg>
            </button>
            <h4>{selectedMember.name}</h4>
            <p>{selectedMember.bio}</p>
          </div>
        </div>
      )}

      <style>
        {`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      position: relative;
      max-width: 500px;
      width: 90%;
      max-height: 90%; /* Ensure it doesn't overflow */
      overflow-y: auto; /* Add scrolling for overflow */
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    @media screen and (max-width: 768px) {
      .modal-content {
        padding: 15px; /* Adjust padding for smaller screens */
      }
      .close-btn svg {
        width: 20px; /* Adjust size for smaller screens */
        height: 20px;
      }
    }
  `}
      </style>
    </Layout>
  )
}

export default About
