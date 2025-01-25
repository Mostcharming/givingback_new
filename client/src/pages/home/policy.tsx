import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import { useLoadStyles } from '../../services/styles'

const PrivacyPolicy = () => {
  useLoadStyles(['givingback'])

  const privacyPolicyData = [
    {
      main: 'Privacy Notice',
      mainContent: [
        `GivingBack Inc. and its affiliates and subsidiaries, including GivingBack Canada, and GivingBack Africa, Limited (collectively, “GivingBack” “we,” “our,” and “us”) provide this Privacy Notice (“Notice”) to explain how we collect, use, and disclose information about you. This Notice applies to data collected by us offline and for all our products or services on which we make this Notice available – for example, when you use GivingBack or the Platform or our mobile applications or when you raise funds on GivingBack for your campaigns or donate to one of our non-profit partners through websites powered by (collectively, the “Services”).`,
        `Before you access, use, or submit any information through or in connection with the Services, please carefully review this Notice. By using any part of the Services, you acknowledge that you have read and understood that we may collect, use, and disclose information about you as outlined in this Notice. To the extent allowed by law, the English version of this Notice is binding, and its translations in other languages are for convenience only; in case of discrepancies between the English version of this Notice and its translations, the English version shall prevail.`,
        `This Notice does not cover the privacy practices of either (i) organizers of GivingBack Projects (collectively, “Organizers”), (ii) beneficiaries of Projects (collectively, “Beneficiaries”), or (iii) nonprofit organizations that use her platform. We are not responsible for the privacy practices of Organizers, Beneficiaries, or Clients, and their handling of your information may be subject to their own privacy statements. This Notice also does not cover our data practices

when we act as a “processor” or “service provider” on behalf of Clients. In those circumstances, we process information about you on behalf of the Client, and you should consult the privacy statement of the Client for information on how they process information
about you.`
      ],
      sub: [
        {
          title: 'INFORMATION WE COLLECT',
          content: `As further described below, we collect information in multiple ways, including when you provide information directly to us, when we collect information about you from other parties, and when we automatically collect information from your browser or device (e.g., by logging how you interact with our Services).`,
          subContent: [
            {
              title: 'A. Information That You Provide Directly to Us:',
              content: [
                'We and our vendors may collect information from you directly in various ways, such as when you:'
              ],
              list: [
                'Open an account or otherwise register for the Services',
                'Create a fundraiser on the Services',
                'Create a peer-to-peer, crowdfunding, or team page',
                'Create, register to participate in a brief and/or other activities',
                'Set up withdrawals or transfers',
                'Donate to a project, organization, or cause',
                'Post comments, leave feedback, send thank-you notes, or otherwise communicate with other users through our Services',
                'Fill out a survey or questionnaire or provide us with feedback regarding the Services',
                'Request certain features (e.g., newsletters, updates, and other products)',
                'Sign up for contests, awards, and events hosted by us',
                'Communicate with us, such as for reporting a project, troubleshooting, or support services'
              ],
              content2: [
                `The information you provide us directly may relate to you or others and may include, without limitation:
Account Registration Information: such as your name, email address and login details, your zip code, your country, your phone number, and certain other information, including any information you choose to provide us (such as a profile picture). If you use the Services as an organization (e.g., a Client or any other registered non- profit), you may also provide us with your organization’s name, your role/title with the organization, tax identification number, 501(c)3 or tax-exempt status, and other information about your organization.`,
                `Projects Information: such as a Projects title, a Projects category, images, videos, description and Projects goal(s).`,

                `Financial Information: such as payment account details for withdrawals and payment information for donations, and billing information. We use third-party payment processors to process financial information. For example, we use Stripe, and Flutterwave for payments, analytics, and other business services. These payment processors may collect personal data, including via cookies and similar technologies. The personal data they collect include transactional data and identifying information about devices that connect to its services. They use this information to operate and improve the services provided to us, including fraud detection, loss prevention, authentication, and analytics related to the performance of services. They operate both as processors for us and independent controllers for the information they collect directly from our users.`,
                `You can learn more about Stripe and read its privacy policy at https://stripe.com/privacy.`,
                `You can learn more about Flutterwave and read its privacy policy
at https://flutterwave.com/us/privacy-policy#2.-how-we-get-your-personal-information-and-why-we-have-it`,

                `Publicly Available and Non-Publicly Available Communications and Content: such as comments, feedback, thank-you notes or other communications with other users through our Services. Any content, including such comments, feedback, and notes that you choose to post on publicly available campaign pages through our Services, are available to the public by default. Please remember that any information that is disclosed in these areas becomes public information for both us and other users to use and share. Take care not to disclose information about you unless you intend for that data to become public. Please also be considerate and respectful of others while using the community to publish your opinions. We reserve the right but do not have the obligation, to review and monitor publicly-available content, non-publicly available communications between users, and any other content made on or through our

Services, and to remove postings or content that may be viewed as inappropriate or offensive to others.`,
                `Information about Yourself and Others, Including Sensitive Information: such as information about a fundraiser, including the beneficiary of a fundraiser, fundraiser goals, and other information you choose to provide, which may include information about situations or other circumstances that motivate a fundraising request. If you provide us with information about others, you acknowledge and agree that you have the authority and consent of the relevant other parties for us to access, disclose, and use the relevant data, and that you have notified the other parties and informed them of how their information is collected and used by GivingBack to provide the Services. We reserve the right to identify you as the person who has made the referral in any messages that are sent to them. You can also provide us with information about yourself or other parties that are considered sensitive, such as political opinions, race, ethnicity, health information, or religious beliefs. If you post this information in a fundraiser, you choose to provide such information to be published publicly in relation to your fundraiser, donation, or otherwise. Subject to applicable law, GivingBack may process any information that has manifestly been made public, including by processing information about you that reveals sensitive information.`,
                `Chats and Other Communications with Us: such as for troubleshooting or support services. We may engage vendors to provide certain interactive features on our Services. Your use of these interactive features is voluntary, and we may retain the information that you submit through these features. For example, we may offer an interactive chat feature on the Services for customer service purposes. When you participate in the interactive chat, the contents of the chat may be captured and kept as a transcript. By using these features, you understand that we and our vendors on our behalf may, on a real-time basis, collect and process the information obtained through the feature. We would ask that you take care not to send financial or health information or other sensitive personal data to us through our chat services or other means unless we ask you specifically for that data as part of providing the Services to you. When you provide such information to us directly, you consent to the processing of this data by GivingBack and/or our vendors. We collect the information listed in this section for the purposes described below in the sections “Our Use of Information Collected” and “Our Disclosure of Information Collected About You.”`,
                `Biometric Information: We sometimes engage vendors to collect biometric information for identity verification, regulatory compliance, and fraud prevention purposes. We or the vendors we engage may collect a copy of your government-issued ID (i.e., your driver’s license, state ID card, or passport) and a scan of the picture on your

government-issued ID for identification purposes. Our vendors may, with your consent, employ facial recognition technology to verify your identity and share the results of their analysis with us, if needed. GivingBack does not have access to or otherwise collect or maintain any biometric information. Your biometric information will be retained by our vendors, and subject to their retention policies and privacy policies.`
              ]
            },
            {
              title: 'B. Information We Collect from Other Parties:',
              content: [
                `GivingBack may use vendors to improve the quality of our own user database so that we might improve our Services to you, for verification and fraud prevention purposes, and as otherwise described in this Notice. In addition, GivingBack obtains contact details and other personal information regarding media contacts and influencers from various groups`,
                `One of the special features of the Services is that they allow you to enable or log into the Services via various social media applications/services, like Facebook or X, or to upload videos using YouTube APIs (each and collectively, the “Social Networking Service(s)”). By directly integrating these Social Networking Services, we aim to make your online experiences richer and more personalized. To take advantage of these features, we will ask you to provide your credentials for the applicable Social Networking Service in order to log in to our Services. When you add a Social Networking Services account to the Services or log into the Services using your Social Networking Services account, we will collect the relevant information necessary to enable the Services to access that Social Networking Service. As part of such integration, the Social Networking Service will provide us with access to certain information that you have provided to the Social Networking Service and made available to us based on your privacy settings with the Social Networking Service (for example, your name and photograph, as well as other information that you permit the Social Networking Service to share with us).`,

                `We will use, store, and disclose such information in accordance with this Notice. However, please remember that the manner in which Social Networking Services use, store, and disclose your information is governed by the policies of such third parties, and GivingBack shall have no liability or responsibility for the privacy practices or other actions of any Social Networking Services that may be enabled within the Services. For example, if you upload a video onto your fundraiser using the mobile application for the Services, your video will be uploaded using YouTube and subject to Google’s Privacy Policy and Google’s Security Settings. You further acknowledge that if you choose to use this feature, your friends, followers, and subscribers on any Social Networking

Services you have enabled may be able to view such activity. For example, if you sign on using Meta, Meta’s Privacy Policy and Terms of Service would apply to the data Meta might obtain from your activities on GivingBack. Please visit the terms of use and privacy policy of the relevant Social Networking Service to learn more about your rights and choices, and to exercise your choices about those technologies.`
              ]
            },
            {
              title:
                'C. Information That is Passively or Automatically Collected:',
              content: []
            },
            {
              title: 'I. Device & Usage Information:',
              content: [
                `When you interact with GivingBack through the Services, we automatically receive and store certain information from devices that you use to access the Services such as your IP address. This information is collected passively by using various technologies and includes the type of Internet browser or mobile device you use, any website from which you have come to the Services, your operating system, and inferred location data through an IP address that identifies the city and state where you logged into the Services. GivingBack either stores such information itself or such information is included in databases owned and maintained by GivingBack, and/or its agents or vendors.`
              ]
            },
            {
              title: 'II. Location Information:',
              content: [
                `When you use the Services to organize a fundraiser, the Services may require that you provide your postcode/zip code, city or town, and state or province of residence. Please keep in mind that other users of the Services can view your postcode/zip code, city or town, and state or province of residence in connection with the fundraiser. If you install our mobile application, we may ask you to grant us access to your mobile device’s precise geolocation data. If you grant such permission, we may collect information about your precise geolocation, and we may use that information to improve the Services, such as providing you with location-based features (e.g. to prepopulate your post code/zip code or to identify Projects near you). We also use your location information as described in this Notice, such as described above under “Device & Usage Information”, and in an aggregate way, as described below in the “Aggregated Data” section. You may opt out of providing your geolocation information in your device’s settings.`
              ]
            },

            {
              title: 'III. Cookies and Other Electronic Technologies:',
              content: [
                `Please review our Cookie Policy for information on the types of cookies we or our vendors use on the Services, along with how we use those cookies and other electronic technologies.
If we are unable to collect your information, we may not be able to provide you with the Services or assist you with your questions.`
              ]
            }
          ]
        },
        {
          title: 'OUR USE OF INFORMATION COLLECTED',
          content:
            'GivingBack uses the information collected from the Services in a manner that is consistent with this Notice. We may use the information that you provide (or otherwise permit the Services to access) for the following purposes:',
          subContent: [
            {
              list: [
                'Provide, operate, and maintain the Services, including to register and maintain your account, facilitate the Know Your Customer (KYC) verification process and to complete transactions',
                'Communicate with you for various purposes, including to help you fundraise more, or for administrative purposes (e.g., to provide services and information that you request or to respond to comments and questions) regarding the Services',
                'Request your feedback',
                'Personalization, marketing, and advertising',
                'Analyze, improve, modify, customize, and measure the Services, including to train our artificial intelligence/machine learning models',
                'Develop new products and services and other research and development',
                'Verify your identity and to detect and prevent fraud or other misuses of the Services',
                'Maintain the security of your account and any associated Projects',
                'Comply with legal obligations, law enforcement requests and legal process and to protect our rights, privacy, safety, or property, and/or that of our affiliates, you, or other parties, including to enforce our Terms of Service and any other agreements',
                'Carry out any other purpose for which the information was collected'
              ],
              content2: [
                `We may combine information that we collect from you through any or all of the Services with information that we obtain from other sources. For example, we may compile information from a variety of sources to generate inferences about you, such as inferences about your likely interests in making charitable or other donations and the potential size of such donations, starting peer-to-peer Projects, signing up for recurring donations or other similar indicators.

We may also aggregate and/or de-identify information collected through the Services. We may use and disclose de-identified or aggregated data for any purpose, including, without limitation, research and marketing purposes.`,
                `We may communicate with you regarding your GivingBack account by SMS, MMS, or text message. For example, when setting up your GivingBack account, if you click “Send code” by “Text Message,” you agree to receive automated and nonautomated text messages related to your account from or on behalf of GivingBack at the phone number provided. You can reply STOP to such text messages to cancel, except for automated text messages related to the security of your account. Message frequency will vary. In the event you change or deactivate your mobile telephone number, you agree to promptly update your GivingBack account information to ensure that your messages are not misdirected. Please note that your wireless service carrier’s standard charges, message and data rates, and other fees may apply where you access the Services through a mobile device. In addition, downloading, installing, or using certain Services on a mobile device may be prohibited or restricted by your carrier, and not all Services may work with all carriers or devices.`,
                `We may also employ machine learning and other analytics that make inferences about some characteristics of our users. We use these tools to tailor emails to you, to show and prioritize causes, Projects, and pages we think you’ll be interested in, to protect you and your account from misuse, and make suggestions about how much you may want to fundraise or donate. To opt out of this use, please submit a request through this form.`
              ]
            }
          ]
        },
        {
          title: 'OUR DISCLOSURE OF INFORMATION COLLECTED ABOUT YOU',
          content:
            'There are certain circumstances in which we disclose information collected about you with certain other parties without further notice to you, as set forth below.',
          subContent: [
            {
              title: 'A. Business Transfers:',
              content: [
                `As we develop our business, we might sell or buy businesses or assets. In the event of a corporate sale, merger, reorganization, dissolution, similar event, or steps taken in anticipation of such events (e.g., due diligence in a transaction), user information may be part of the reviewed and transferred assets.`
              ]
            },
            {
              title: 'B. Affiliates and Subsidiaries:',
              content: [
                `We disclose your personal information among the GivingBack entities, including our affiliates and subsidiaries, for purposes consistent with this Notice, such as to provide

our Services, including hosting; marketing, and publicizing Projects; providing you with customer support; administering funds in connection with Projects; preventing fraud and misuse; authenticating donors; sending you communications; improving Services offered by the various GivingBack entities and conducting the other activities described in this Notice.`
              ]
            },
            {
              title: 'C. Agents, Consultants, and Vendors:',
              content: [
                `GivingBack contracts with other companies to help us perform certain business-related functions, and we provide access to or disclose your information with these companies so they can perform services for us. Examples of such functions include marketing, mailing information, data storage, security, identity verification, fraud prevention, payment processing, preventing fraud and misuse, legal services, and database maintenance. Our websites and checkout experiences for Clients that are powered by are protected by reCAPTCHA and Google Privacy Policy and Terms of Service apply.`
              ]
            },
            {
              title: 'D. Legal Requirements:',
              content: [
                `We may transfer, disclose to, and preserve your information for courts, law enforcement, governmental or public authorities, tax authorities, or authorized third parties, if and to the extent we are required or permitted to do so by law or where disclosure is reasonably necessary to: (i) comply with our legal obligations, (ii) comply with a valid legal request (such as a subpoena or court order), (iii) respond to claims asserted against us, (iv) respond to a valid legal request relating to a criminal investigation to address alleged or suspected illegal activity or to respond to or address any other activity that may expose us, you or any other of our users or members of the public to imminent harm, legal or regulatory liability, (v) enforce and administer our Terms of Service or other policies, or (vi) protect the rights, property or personal safety of GivingBack, its affiliates, its employees, its users, or members of the public.`
              ]
            },
            {
              title: 'E. Organizers, Nonprofit Beneficiaries, and Clients:',
              content: [
                `Organizers. We may disclose your information to Organizers, which may or may not be the same as the Beneficiaries of the fundraiser. For example, if you donate to a fundraiser for an individual, we may disclose your name and donation amount to the Organizer who may in some instances also be the Beneficiary. Likewise, if you donate to a nonprofit through , you direct us to disclose your donation, contact information and any other information you provide to the applicable nonprofit.`,
                `Nonprofit Beneficiaries. Organizers may create Projects designating a nonprofit organization as a Beneficiary. Where a nonprofit organization is designated as the Beneficiary, that nonprofit organization may access certain information about the Campaign Organizer and donor information, including the donor’s name, email address, donation amount, date of transaction, transaction identification number, and name of the campaign. GivingBack contractually requires the nonprofit organization to use such information solely to communicate with you about your donation and for legal and auditing requirements. GivingBack may authorize nonprofit organizations
to process your information for other purposes (such as marketing) if you opt-in to that processing.`,
                `Clients and Their Vendors/Partners. may power the donation pages and other activities, such as event hosting for Clients. If you donate to a nonprofit through a -powered webpage, you direct us to disclose your donation and contact information to the applicable nonprofit, and such information shall also be subject to the privacy policies and practices of that Client. Clients may also direct us to further disclose your personal information to other third parties such as CRM tools or other integration partners used by the relevant Client. We may also disclose certain information about you, such as information about your interests and donation preferences, to Clients who may use such data for their fundraising and marketing operations.`,
                `“Anonymous” Donations Limited to Public Activity Feeds. If you selected not to be named publicly on the public fundraiser pages on the Services, while your donation will be designated as “anonymous” on the public activity feed, your name and other information may still be visible to the Client, Organizer, any of their team members and the Beneficiary, and will be otherwise processed in accordance with
this Notice.`
              ]
            },
            {
              title: 'F. Your Consent',
              content: [
                `In certain situations, we may disclose your information when you consented to the disclosure of your information. For example, we may partner with third party organizations to arrange for specific Projects. If you consent to our providing your contact information to a specific partner, we will disclose the following information with the partner organization: your name, email address and other information you have provided in connection with your donation to the specific fundraiser. Additionally, with the applicable Organizer’s or Beneficiary’s consent, we may provide their personal information to journalists and media to help amplify a campaign.`
              ]
            },
            {
              title: 'G. Aggregated Data',
              content: [
                `We aggregate, anonymize and/or de-identify information collected actively or passively about you so that the information no longer relates to you individually. We then use that data for various legally permissible purposes, including but not limited to our research on our customer demographics, interests and behavior. We also disclose this information with our affiliates, agents, business partners, research facilities or other third parties.`
              ]
            },
            {
              title: 'H. Cookies and Other Electronic Technologies',
              content: [
                `Information is disclosed as stated in the Cookie Policy.`
              ]
            },
            {
              title: 'I. Other Users of Our Services',
              content: [
                `We provide your information to other users of our Services if you choose to make your information publicly available in a publicly accessible area of the Services, such as in your fundraiser through your donations or in the comments.`
              ]
            }
          ]
        },
        {
          title: 'VOLUNTEERED INFORMATION',
          content: `Please be advised that some information you provide may be publicly accessible, such as information posted in forums or comment sections. When you launch a fundraiser, you make certain information publicly available and thus not protected by certain data protection laws. We also collect information through forums and communities, surveys and customer support communications, your communication to us of ideas for new products or modifications to existing products, feedback, and other solicited or unsolicited submissions (collectively, with publicly-accessible information, “Volunteered Information”). Subject to applicable law, by sending us Volunteered Information, you further agree that we are under no obligation
of confidentiality, express or implied, with respect to the Volunteered Information. This Volunteered Information section shall survive any termination of your account or the Services.`
        },
        {
          title: `ONLINE ANALYTICS AND TAILORED ADVERTISING`,
          subContent: [
            {
              content: [
                `Analytics. We may use third-party web analytics services on the Services, such as those of Google Analytics. These vendors use the sort of technology described in the “Information That is Passively or Automatically Collected” section above and in our Cookie Policy to help

us analyze how users use the Services, including by noting the third-party website from which you arrive. The information collected by such technology will be disclosed to or collected directly by these vendors, who use the information to evaluate your use of the Services. We also may use Google Analytics for certain purposes related to advertising, as described in the following section. To prevent Google Analytics from using your information for web analytics, you may install the Google Analytics Opt-Out Browser Add-on.`,
                `Tailored Advertising. We may allow third-party advertising networks to place cookies or other tracking technologies on your computer, mobile phone, or other device to collect information about your use of the Services in order to (a) inform, optimize, and serve marketing content based on past visits to our website and other online services and (b) report how our marketing content impressions and interactions with these marketing impressions are related to visits to our online services. We may also allow other unaffiliated parties (e.g., ad networks and ad servers such as Google Analytics) to serve tailored marketing to you and to access their own cookies or other tracking technologies on your computer, mobile phone, or other device you use to access the Services. Those parties that use these technologies may offer you a way to opt out of targeted advertising as described below. You may receive tailored advertising on your computer through a web browser. Cookies may be associated with de- identified data linked to or derived from data you voluntarily have submitted to us (e.g., your email address) that may be disclosed to a vendor in hashed, non-human-readable form.`,
                `We may use certain Meta products, such as the Meta Conversion API, on our Services (see our Cookie Policy for further information regarding digital advertising and cookies and similar technologies). We may use the product for certain analytics and marketing purposes as described in this Notice, including for measuring the effectiveness of Facebook ads for statistical and market research purposes. Meta Platforms Ireland Limited (“Meta”) acts as a joint controller of processing with GivingBack within the scope of the General Data Protection Regulation for certain of the processing activities relating to marketing and ad measurements. Information about how Meta processes your information, the legal basis for the processing, and how to contact Meta to exercise your rights with regard to information stored by Meta can be found at https://www.facebook.com/about/privacy.`,
                `If you are interested in more information about tailored advertising and how you can generally control cookies from being put on your computer to deliver tailored marketing, you may visit the Network Advertising Initiative’s (“NAI”) Consumer Opt-Out Link, the Digital Advertising Alliance’s (“DAA”) Consumer Opt-Out Link, and/or the European Interactive Digital Advertising Alliance to opt-out of receiving tailored advertising from companies that participate in those programs. To exercise choices about how Google personalizes Display Advertising or to customize Google Display Network ads, you can visit the Google Ads Settings page. Please note that to the extent advertising technology is integrated into the

Services, you may still receive advertising content even if you opt out of tailored advertising. In that case, the advertising content may not be tailored to your interests. Also, we do not control any of the above opt-out links and are not responsible for any choices you make using these mechanisms or the continued availability or accuracy of these mechanisms. If your browsers are configured to reject cookies when you visit these opt-out pages, or you subsequently erase your cookies, or use a different computer or change web browsers, your opt-out may no longer be effective.`
              ]
            }
          ]
        },
        {
          title: `CHILDREN`,
          subContent: [
            {
              content: [
                `Our Services are not designed for use by individuals under the age of 13 (or 16 for children located in the European Economic Area or United Kingdom). If you are under the age of 13 (or 16 for children located in the European Economic Area or United Kingdom), please do not use the Services and/or submit any information through the Services. If you have reason to believe that a child under the age of 13 (or 16 for children located in the European Economic Area or United Kingdom) has provided personal information to GivingBack through the Services, please contact us at GFMlegal@GivingBack.com, and we will delete that information from our databases to the extent required by law.`,
                `Moreover, if you provide us with information about children under the age of 16, you acknowledge and agree that either you are the child’s parent/legal guardian or you have the authority and consent of the child’s parent/legal guardian to create a campaign/fundraiser and for us to access, disclose, and use the relevant data.`
              ]
            }
          ]
        },
        {
          title: 'LINKS TO OTHER WEBSITES',
          content: `The Services can contain links to other web sites not operated or controlled by GivingBack (the “Third-Party Sites”). The policies and procedures we described here do not apply to the Third-Party Sites. The links from the Services do not imply that GivingBack endorses or has reviewed the Third-Party Sites. We suggest contacting those sites directly for information on their respective privacy policies.`
        },
        {
          title: `SECURITY`,
          content: `We may hold your information we have collected in paper and/or electronic form. While no organization can guarantee perfect security, GivingBack has implemented and seeks to continuously improve technical and organizational security measures to protect the information provided via the Services from loss, misuse, unauthorized access, disclosure,

alteration, or destruction. Please see here for details about security for GivingBack.com and here for details about ’s platform.`
        },
        {
          title: 'RETENTION OF YOUR INFORMATION',
          content: `We retain your information for as long as we deem necessary for the purpose for which that information was collected and for our legitimate business operations; provided, however, that your information is only retained to the extent permitted or required by applicable laws. When determining the retention period for your information, we take into account various criteria, such as the type of products and services requested by or provided to you, the nature and length of our relationship with you, possible re-enrollment with our products or services, the impact on the Services we provide to you if we delete some information about you, mandatory retention periods provided by law, and any applicable statute of limitations.`
        },
        {
          title: `CROSS BORDER DATA TRANSFERS`,
          content: `GivingBack is a global organization headquartered in the Canada, and we may process your information in various countries, including the Canada and United States.`
        },
        {
          title: `USERS FROM OUTSIDE THE UNITED STATES`,
          content: `The Services are hosted in the United States. If you are visiting the Services from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States and other locations where our servers and personnel are located, and our central database is operated. The data protection and other laws of the United States and other countries might not be as comprehensive as those in your country, and data may be accessible to law enforcement and national security authorities under certain circumstances.`
        },
        {
          title: `YOUR CHOICES`,
          subContent: [
            {
              content: [
                `We offer you certain choices regarding the collection, use, and disclosure of information about you.

Account Information. You may have the ability to create an account in the Services. You may verify, correct, update, or delete certain of your information through your account profile page.`,
                `Marketing Communications. Each email marketing communication we send you will contain instructions permitting you to “opt out” of receiving future marketing communications. In addition, if at any time you wish not to receive any future marketing communications or you wish to have your name deleted from our mailing lists, please contact us at the email address or mailing address set forth under “Contacting GivingBack.” If you opt out of receiving marketing communications or other information we think may interest you, we can still send you certain emails about your account or any Services you have requested or received
from us.`,
                `Cookies and Analytics. You can opt out of certain cookie-related and analytics processing by following the instructions in this Notice.`,
                `Rights to Information About You. Presently, residents of certain jurisdictions have certain rights with respect to their information. Depending on your jurisdiction, you may request that we:`
              ],
              list: [
                'Provide you with information about the categories of personal information we collect or disclose about you; the categories of sources of such information; the business or commercial purpose for collecting such information; and the categories of unaffiliated parties to whom we disclose such personal information. Such information is also set forth in this Notice',
                'Provide access to and/or a copy of certain information we hold about you',
                'Prevent the processing of your information for direct-marketing purposes (including any direct marketing processing based on profiling)',
                'Update information which is out of date or incorrect',
                'Delete certain information that we are holding about you',
                'Restrict the way that we process and disclose certain information about you',
                'Transfer your information to a third-party provider of services',
                'Opt you out of the processing of your personal information for purposes of profiling in furtherance of decisions that produce legal or similarly significant effects, if applicable',
                'Revoke your consent for the processing of your information provided that the withdrawal of consent shall not affect the lawfulness of the processing based on consent before its withdrawal'
              ],
              content2: [
                `You may be able to designate an authorized agent to make requests on your behalf. In order for an authorized agent to be verified, you must provide the authorized agent with signed, written permission to make such requests or a power of attorney. We may also follow up with you to verify your identity before processing the authorized agent’s request as permitted by applicable law.`,
                `Please note that certain information may be exempt from such requests under applicable law. For example, we may retain certain information for legal compliance and to secure our Services. We also may need certain information in order to provide the Services to you; if you ask us to delete it, you may no longer be able to use the Services.`,
                `You also have the right not to be discriminated against (as provided for in applicable law) for exercising your rights.`,
                `You may also have the right to opt out of sales of your personal information, or the processing of your personal information for targeted advertising. To opt out of any future targeted advertising we may offer, please use the tools described in the section above on Online Analytics and Tailored Advertising, or in our Cookie Policy. We may “sell” information about you to certain partners such as nonprofit organizations to help them understand your likely interests in making charitable or other donations, the potential size of such donations, or your interests in starting peer-to-peer Projects, signing up for recurring donations or other similar indicators. To opt out of “sales” of your personal information that do not involve cookies or other online tracking technologies, please complete this form.`,
                `If you would like information regarding your rights under applicable law or would like to exercise any of them, contact us at the email address or mailing address set forth under “Contacting GivingBack.” For your own privacy and security, at our discretion, we may require you to provide your identity before providing the requested information. To protect your privacy and security, we take reasonable steps to verify your identity and requests before granting such requests. If we are unable to verify your identity, we may be unable to respond to your requests.`,
                `Depending on applicable law, if we deny your request, you may have the right to appeal our decision to deny your request. We will provide information about how to exercise that right in our response denying the request.`
              ]
            }
          ]
        },
        {
          title: 'REGIONAL PRIVACY DISCLOSURES',
          subContent: [
            {
              title: 'USERS IN EUROPE AND UNITED KINGDOM',
              content: [
                `If you are in the European Economic Area (“EEA”), the United Kingdom or Switzerland (collectively “Europe”) and have used the GivingBack Services under a contractual relationship under the Terms of Service with GivingBack Ireland, then for the purposes of the EU General Data Protection Regulation 2016/679 (the “GDPR”), the UK GDPR , and the Swiss Federal Act of 19 June 1992 on Data Protection (FADP) and the Privacy and Electronic Communications Directive 2002/58/EC on Privacy and Electronic Communications (ePrivacy Directive), the data controller is GivingBack Ireland Limited. and can be reached at the address set out at “Contacting GivingBack” below; and`
              ],
              list: [
                `For the Users in the EEA that do not fall under the previous paragraph, and to the extent that this would be required by GDPR, GivingBack Ireland also acts as representative in the EU of GivingBack Inc.`
              ]
            }
          ]
        },
        {
          subContent: [
            {
              content: [
                `If you are located in Europe, our legal grounds for processing your information may be as follows:`
              ],
              list: [
                'Consent: Where you have given consent to such processing for one or more specific purposes',
                'Contractual Obligation: Where the processing is necessary for the performance of a contract with you',
                'Legal Obligation: Where processing is necessary for compliance with our legal obligation',
                'Legitimate Interest: Where processing is necessary for our legitimate interests or the legitimate interests of our users and your interests and fundamental rights and freedoms do not override those interests'
              ],
              content2: [
                `We transfer your personal data to third countries subject to appropriate safeguards, such as standard contractual clauses.`,
                `Residents of Africa and Europe also have the right to lodge a complaint with the local data protection authority if you believe that we have not complied with applicable data protection laws. You also have the right to lodge a complaint with the supervisory authority of your residence, place of work or where the incident took place. However, we encourage you to contact us first, and we will do our very best to resolve your concern.`
              ]
            }
          ]
        },
        {
          title: 'OTHER TERMS',
          content:
            'Your access to and use of the Services is subject to GivingBack’s Terms of Service and such other terms, which may be made available to you in connection with your use of the Services.'
        }
      ]
    }
  ]

  return (
    <Layout>
      <PageBanner pageName='Privacy Policy' />
      <section className='privacy-policy-section section-gap-extra-bottom'>
        <div className='container'>
          {privacyPolicyData.map((section, index) => (
            <div key={index}>
              {section.main && <h2>{section.main}</h2>}
              <p style={{ fontSize: '18px' }}>
                {section.mainContent && (
                  <>
                    {section.mainContent.map((content, idx) => (
                      <>
                        <br />
                        <p style={{ fontSize: '18px' }} key={idx}>
                          {content}
                        </p>
                        <br />
                      </>
                    ))}
                  </>
                )}
              </p>

              {section.sub.map((subSection, subIndex) => (
                <div key={subIndex}>
                  {subSection.title && (
                    <>
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
                  {subSection.subContent && (
                    <>
                      {subSection.subContent.map(
                        (subSubSection, subSubIndex) => (
                          <div key={subSubIndex}>
                            <h4>{subSubSection.title}</h4>
                            {subSubSection.content && (
                              <>
                                {subSubSection.content.map((content, idx) => (
                                  <>
                                    <p style={{ fontSize: '18px' }} key={idx}>
                                      {content}
                                    </p>
                                    <br />
                                  </>
                                ))}
                              </>
                            )}
                            {subSubSection.list && (
                              <ul
                                style={{
                                  listStyleType: 'disc',
                                  paddingLeft: '20px',
                                  fontSize: '18px'
                                }}
                              >
                                {subSubSection.list.map((item, listIndex) => (
                                  <li key={listIndex}>{item}</li>
                                ))}
                              </ul>
                            )}
                            {subSubSection.content2 && (
                              <>
                                {subSubSection.content2.map((content, idx) => (
                                  <>
                                    <p style={{ fontSize: '18px' }} key={idx}>
                                      {content}
                                    </p>
                                    <br />
                                  </>
                                ))}
                              </>
                            )}
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default PrivacyPolicy
