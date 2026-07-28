import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import { useLoadStyles } from '../../services/styles'
import { PrivacyPolicySection } from '../../types'

const Aml: React.FC = () => {
  useLoadStyles(['givingback'])
  const privacyPolicyData: PrivacyPolicySection[] = [
    {
      main: 'Anti-Money Laundering Policy and Procedure',
      mainContent: [
        `Introduction
        `,
        `GivingBack Nigeria recognizes the importance of preventing money laundering and terrorism financing and is committed to the highest standards of Anti-Money Laundering and Combating Terrorist Financing in Nigeria.
        `,
        `GivingBack Nigeria , as a designated non-financial institution (DNFI), is subject to applicable legislation designed to prevent Money Laundering. This legislation includes legislation such as: Terrorism Prevention Act 2103, Money Laundering Prohibition Act, 2011 (as amended) and others.
        `,
        `To fulfil this commitment, GivingBack Nigeria has established internal policies and procedures. This Policy establishes standards which every employee, contractor and business partner of GivingBack Nigeria should observe.
        `
      ],
      sub: [
        {
          title: '1. Scope',
          content: [
            `
Money Laundering is the process of any activity by which criminally obtained money or other assets (criminal property) are exchanged for “clean” money or other assets with no obvious link to their criminal origins.
Criminal proceeds may take any form, including money or money’s worth, securities, tangible property and intangible property.
Terrorism Financing is defined as providing, depositing, distributing or collection funds, directly or indirectly, intended to be used, or knowing that these funds are to be wholly or partially use, for the committing of terrorist acts.
This Policy is aimed to prevent any company or individual from using GivingBack Nigeria for money laundering or terrorist financing activities.
`
          ]
        },
        {
          title: `2. Our Policy`,
          subContent: [
            {
              content: [
                `
          2.1. Customer Due Diligence
          `,
                `To prevent Money Laundering, GivingBack Nigeria will implement processes and procedures in its Line of Businesses (LOBs) to conduct appropriate customer due diligence through the GivingBack Nigeria ’s Business Partner Screening Questionnaire, identifying the customer and verifying the customer’s identity on the basis of the following “Know Your Customer” principles:
          `
              ],
              list: [
                ` Customer provided documentation (Verification Checking);
 `,
                `Information on the customer obtained from reliable and independent sources (Ownership Checking);
`,
                `Compliance with GivingBack Nigeria ’s Business Codes.
`
              ],
              content2: [
                `Unusual activity during the customer due diligence process or customer engagement should be reported immediately to the designated GivingBack Nigeria Chief Compliance department or commercial department.
                `,
                `2.2. Risk-Based Approach
                `,
                `For GivingBack Nigeria , the threat of being involved in money laundering and terrorist financing activities depends directly on the type of business that GivingBack Nigeria ’s customers carry out or on the country where GivingBack Nigeria ’s customers are located.
                `,
                `GivingBack Nigeria will classify its customers based on a risk level in its applicable line of business processes and procedures. Identifying the potential risk will help to effectively manage these risks, implementing controls to mitigate the identified risk, if any.
                `,
                `2.3. High Risk Customers
                `,
                `GivingBack Nigeria will not do business with the following segments of customers:
                `
              ]
            }
          ]
        },
        {
          subContent: [
            {
              list: [
                ` Persons included in any official lists of sanctions, in line with the GivingBack Nigeria Sanctions Policy;
`,
                ` Persons indicating possible involvement in criminal activities, based on available information about them;
`,
                ` Persons with businesses in which the legitimacy of activity or source of funds can’t be reasonably verified;
`,
                `Persons refusing to provide the required information or documentation; or
 `,
                `Entities whose shareholder/control structure cannot be determined.
`
              ],
              content2: [
                `2.4. Record Keeping
`,
                `Customer documentation can either be submitted in physical or electronic form. An appropriate record of the received documentation, steps taken and copies of, or reference to, the documentation of the customer must be kept.
`,
                `Records should be kept for as long as the relationship endures with the customer and for at least five (5) years after the relationship ends. In countries where this period exceeds the established period of time, the legally established time period will be considered to comply with local law.
`,
                `2.5. Designation of Anti- Money Laundering Reporting Officer (AMLO)
`,
                `GivingBack Nigeria will designate an Anti-Money Laundering Officer. The Anti-Money Laundering officer will be responsible for:
`
              ]
            }
          ]
        },
        {
          subContent: [
            {
              list: [
                ` Considering internal reports of money laundering;
`,
                ` Reporting suspicions of money laundering to the responsible authorities; and
`,
                ` Acting as key liaison with the money laundering authorities.
`,
                ` Training the business and its employees on money laundering;
`,
                ` Submitting weekly reports to the Special Control Unit Against Money Laundering (SCUML)
`,
                ` Advising on proceed after a report of suspicion on money laundering has been raised; and
`,
                ` Designing and implementing Anti-Money Laundering processes and procedures.
`
              ]
            }
          ]
        },
        {
          title: `3. Reporting Suspicious Activity`,
          subContent: [
            {
              content: [
                `GivingBack Nigeria expects that, if any employee, contractor or business partner becomes aware of any suspicion or knowledge of possible Money Laundering activity, this is reported without undue delay to the AMLO. This can either be done contacting directly the AMLO or his deputy.
            `,
                `A report on suspicious activity should contain, at least, the following information, which will be confirmed by the AMLO:
            `
              ],
              list: [
                `Identity of the person raising the suspicion;
`,
                `Date of the report;
`,
                `Who is suspected of money laundering or terrorist financing activities;
`,
                `Other individuals involved otherwise;
`,
                `Deliverance of facts;
`,
                `What is suspected and why; and
`,
                `Any possible involvement of GivingBack Nigeria .
`
              ],
              content2: [
                `The AMLO may make reasonable enquiries within GivingBack Nigeria to confirm these suspicions or obtain additional information to confirm these suspicions. After this assessment, the AMLO will determine whether or not it is necessary to file an official report to the responsible money laundering authority.
`,
                `Details of internal reports will be held by the AMLO separately, excluded from customer files, to avoid inadvertent or inappropriate disclosure.
`
              ]
            }
          ]
        },
        {
          title: `4. Training`,
          subContent: [
            {
              content: [
                `GivingBack Nigeria has a high commitment to compliance and all employees and contractors are required to complete mandatory compliance training, including provisions on anti-money laundering, on an annual basis.
`,
                `Job-specific and comprehensive anti-money laundering training should be provided to the relevant employees to help recognize and deal with transactions which may lead to money laundering or terrorist financing.
`
              ]
            }
          ]
        },
        {
          title: `5. Policy Review and Audits`,
          content: [
            `Regular reviews of the effectiveness of this Policy are carried out in addition to audits periodically undertaken by the GivingBack Nigeria Internal Audit function. This provides Executive Management and the Board Audit Committee with the necessary assurance and information regarding the operating effectiveness of GivingBack Nigeria ’s controls and processes relating to this Policy.`
          ]
        }
      ]
    }
  ]

  return (
    <Layout>
      <PageBanner pageName='Anti-Money Laundering' />
      <section className='privacy-policy-section section-gap-extra-bottom'>
        <div className='container'>
          {privacyPolicyData.map((section, index) => (
            <div key={index}>
              {section.main && <h2>{section.main}</h2>}
              {section.mainContent?.map((content, idx) => (
                <>
                  <br />
                  <p key={idx} style={{ fontSize: '18px' }}>
                    {content}
                  </p>
                </>
              ))}
              {section.sub.map((subSection, subIndex) => (
                <div key={subIndex}>
                  {subSection.title && (
                    <>
                      <br />
                      <h4>{subSection.title}</h4>
                      <br />
                    </>
                  )}
                  {subSection.content && (
                    <>
                      <p style={{ fontSize: '18px' }}>{subSection.content}</p>
                      <br />
                    </>
                  )}
                  {subSection.subContent?.map((subSubSection, subSubIndex) => (
                    <div key={subSubIndex}>
                      {subSubSection.title && <h5>{subSubSection.title}</h5>}
                      {subSubSection.content?.map((content, idx) => (
                        <>
                          <p style={{ fontSize: '18px' }} key={idx}>
                            {content}
                          </p>
                          <br />
                        </>
                      ))}
                      {subSubSection.list && (
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          {subSubSection.list.map((item, listIndex) => (
                            <li key={listIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {subSubSection.content2?.map((content, idx) => (
                        <>
                          <p style={{ fontSize: '18px' }} key={idx}>
                            {content}
                          </p>
                          <br />
                        </>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default Aml
