import PageBanner from '../../components/home/pageBanner'
import Layout from '../../layouts/home'
import { useLoadStyles } from '../../services/styles'

const Terms = () => {
  useLoadStyles(['givingback'])

  const privacyPolicyData = [
    {
      main: 'GivingBack Terms of Service',
      sub: [
        {
          title: `1. Introduction`,
          subContent: [
            {
              content: [
                `1.1. Purpose of the Terms: Welcome to GivingBack! These Terms of Service, which we may update from time to time, apply to the GivingBack Platform, including our website at www.GivingBackNG.org, mobile apps, and any new features we might add. These Terms of Service are important because they help define our relationship with you as you use the Platform. “GivingBack,” “we,” “us,” “our,” and other similar terms, shall refer to the party you are contracting with.`,
                `1.2. Acceptance of Terms: By using any of the Services or the Platform, you’re agreeing to these Terms of Service. This means you understand and accept all the rules about using our Services. Whether you are contributing to a Project as a Donor, starting a Project, withdrawing funds as an Organizer, Beneficiary, or NGO, or otherwise interacting with the Services, these terms apply to you. Depending on where you live, you might be entering into this agreement with different GivingBack entities. If you are located in the Canada, you are contracting with GivingBack, Inc. If you are located in Nigeria, you are contracting with GivingBack Nig Ltd. If you are located anywhere else in the world, you are contracting with GivingBack Inc. Canada. However, GivingBack, Inc. may apply, and exercise our rights under, these Terms of Service on behalf of the party that you are contracting with. Please see the bottom of these Terms of Service for the addresses and contact information for each of these GivingBack entities.`,
                `1.3. Quick Note on Arbitration: If you’re using GivingBack in the Nigeria or Canada, you need to know about our arbitration agreement. By using our Services, you are agreeing that if there’s a disagreement or legal issue between you and GivingBack, it will be resolved through binding arbitration, not in court. You also waive your right to be part of a class action lawsuit or to have a jury trial. Please make sure to read the “Dispute Resolution & Arbitration” section of these Terms of Service for more details.`
              ]
            }
          ]
        },
        {
          title: `2. Definitions`,
          subContent: [
            {
              content: [
                `These are the key terms that you need to know that will be referenced throughout these Terms of Service:
`,
                `2.1. Account: A unique account created by a user to access and utilize GivingBack’s Services, which includes personal information, credentials, and activity logs.
`,
                `2.2. Affiliates: Any entity that directly or indirectly controls, is controlled by, or is under common control with GivingBack. This includes subsidiaries, parent companies, and any other related entities.
`,
                `2.3. Beneficiary: The individual, group or entity for whose benefit the corresponding Project is conducted and who is the intended recipient of the funds raised.
`,
                `2.4. Certified NGO: Any 501(c)(3) non-profit /non-governmental organization that has successfully enrolled on our platform wallet to receive donations.
`,
                `2.5. Donor: Any individual or entity that contributes funds to a Project on or through the Services.
`,
                `2.6. Project: A campaign initiated on the Services with the goal of raising funds for a specific purpose for a Beneficiary.
`,
                `2.7. NGO: A non-profit /non-governmental organization (including churches, universities or other educational institutions) that is established for charitable purposes under applicable laws and is eligible to receive donations through the Platform.
`,
                `2.8. Organizer: An individual or entity (including a non-profit organization) who initiates and manages a Project on the Platform.
`,
                `2.9. Platform: The entire suite of online Services provided by GivingBack and its Affiliates, including our website, mobile applications, and any related services or technologies.
`,
                `2.10. Recurring Fee: A recurring fixed fee that we may charge when donors set up a recurring donation to a Project. .
`,
                `2.11. Services: The various features, functionalities, and tools provided by GivingBack and its Affiliates through its Platform, enabling Users to create and manage Projects, donate and interact with each other.
`,
                `2.12. Services Content: All content and materials provided by GivingBack on the Services, including text, graphics, logos, images, and software, excluding User Content.
`,
                `2.13. Software: The proprietary software and applications provided and owned by GivingBack that enable users to access and use the Services.
`,
                `2.14. Third Party Resources: Any websites, Services, content, or resources provided by entities other than GivingBack or its Affiliates, which may be accessible through the Services.
`,
                `2.15. Transaction Fee: A fee charged by GivingBack or its payment processors for processing donations.
`,
                `2.16. Transfers: The process of moving funds raised through the Services to the Beneficiary’s bank account or other designated account.
`,
                `2.17. User: Any individual or entity that accesses, registers for, or uses the Platform, including Organizers, Donors, and Beneficiaries.
`,
                `2.18. User Content: Any content, including text, images, videos, and other materials, that a User posts, uploads, submits, or otherwise makes available or shares with other Users on or through the Services.
`,
                `2.19. User Conduct: The behaviors and actions of Users while using or otherwise accessing the Services.
        `
              ]
            }
          ]
        },
        {
          title: `3. The Services We Provide`,
          subContent: [
            {
              content: [
                ` 3.1. Description of the Services provided: We offer a Platform for individuals, entities, or nonprofits, non-governmental organization to create Projects to collect monetary donations from Donors for themselves or a third party who will benefit from the funds.
                `,
                `3.2. Our Role and Limitations: Our Services are a tool for running Projects and for helping Organizers connect with Donors; we are not a bank, payment processor, broker, charity, or financial advisor. We do not solicit donations, the existence of the Services is not a solicitation of donations, and we do not engage in solicitation activities for ourselves or others on our Platform. All information provided through our Services is for your general knowledge and isn’t meant to be professional advice. If you need specific advice, especially regarding financial, legal, or tax issues, you should consult with a professional. We do not control or endorse any User, Project, or cause, and we can’t guarantee the success of a Project. As a Donor, it’s up to you to decide if a cause is worth contributing to.
                `,
                `3.3. Modification, Suspension, or Termination of the Services: We can change, pause, or stop all or some of the Services at any time and for any reason. We will try to avoid any problems this might cause you or others, but sometimes we might not be able to give you advance notice, especially if it’s an emergency or required by law. We are not responsible for any issues that these changes might cause.
              `
              ]
            }
          ]
        },
        {
          title: `4. Account Creation and Eligibility Requirements`,
          subContent: [
            {
              content: [
                ` 4.1. What You Need for Registration: When you sign up to use certain Services, you must provide information that is correct and complete about yourself, your organization, or your NGO. This includes your real name, address, phone number and any photos or videos that you may provide, if you’re organizing the Project. It’s important to always keep this information up to date to ensure everything runs smoothly. Our Privacy Notice and these Terms of Service govern the registration data and any other information you provide.
               `,
                ` 4.2. Compliance with Third-Party Services: You might also need to register with third-party payment processors we work with, which may involve agreeing to their terms
                (provided under the Payment Processor section below). If, at any point, we or our payment processors discover that the information you provided to us is inaccurate, violates our Terms of Service or terms of service of our payment processors, or if you misuse the funds, we may immediately suspend or terminate your access to all or some of our Services. You could also face criminal charges by relevant governmental authorities.
                `,
                `4.3. Age Restrictions: If you are under 18 years old you cannot use the Platform or Services, even with registration. If you’re not yet an adult in your area, which usually means being under 18 or 19 depending on the law where you live, you can only use our Platform or Services with your parent’s or guardian’s permission.
                `,
                `4.4. Keeping Your Account Safe: You are responsible for keeping your password and account information confidential. Do not share your password with anyone. If you think someone else has used your Account without your permission, you should tell us right away. Also, always remember to log out of your Account when you’re done using it, especially if you’re on a computer that others can use too. If you don’t keep your Account safe and comply with these Terms of Service, GivingBack won’t be responsible for any losses that you may incur.
                `,
                `4.5. Mobile Services and Text Messages: The Services include certain features that may be made available via a mobile device, including the ability to: (i) upload User Content to the Platform; (ii) browse the Platform; and (iii) access certain items through an application downloaded and installed on a mobile device (collectively, the “Mobile Services”). To the extent you access Mobile Services, your wireless service carrier’s standard charges, data rates and other fees may apply. In addition, downloading, installing, or using certain Mobile Services may be prohibited or restricted by your carrier, and not all Mobile Services may work with all carriers or devices. By using the Mobile Services, you agree that we may communicate with you about matters related to your Account or security by SMS, MMS, text message or other electronic means to your mobile device and that certain information about your usage of the Mobile Services may be communicated to us. Further, when setting up your GivingBack Account, if you click “Send code” by “Text Message,” you agree to receive automated and non automated text messages related to your Account from or on behalf of GivingBack at the phone number or electronic mail provided. You can reply STOP to such text messages to cancel, except for automated text messages related to the security of your Account. Message frequency will vary. Message and normal data rates may apply. We will comply with any additional requirements that may apply under local laws and regulations before communicating with you in this manner. In the event that you change or deactivate your mobile telephone number or electronic mail, you agree to
                promptly update your GivingBack Account information to ensure that your messages are not sent to the person that acquires your old number or electronic mail.
`
              ]
            }
          ]
        },
        {
          title: `5. Payment Processors`,
          subContent: [
            {
              content: [
                `GivingBack itself does not hold any funds raised on our Platform, nor does it handle the actual processing of payments. Instead, we use third-party payment processors to manage and process all donations for Projects. To Transfer funds from a Project, you must provide your bank account details to our payment processor partners.
            
            `,
                `By making a Donation, setting up a Project or accepting the role of Beneficiary to a Project, you agree to the processing, use, Transfer or disclosure of data by the Payment Processors pursuant to these Terms of Service as well as any and all applicable terms set forth by the applicable Payment Processors. Our current Payment Processors include: Flutterwave Nig (Flutterwave’s Terms and Conditions) and Stripe, Inc. (Stripe’s terms of service).`,
                `For more details, including how we handle data with these third party payment processors, please refer to our Privacy Notice, Flutterwave Nig (Flutterwave’s Terms and Conditions) and Stripe, Inc. (Stripe’s terms of service).`
              ]
            }
          ]
        },
        {
          title: `6. User Responsibilities and Obligations`,
          subContent: [
            {
              content: [
                `6.1. Organizers: As an Organizer, you represent and warrant that all the information you provide (whether directly, or through an agent or by using artificial intelligence) about your Project is accurate, complete, and clear. You are responsible for describing on your Project how funds will be used, and ensuring the funds raised are only used for that specific purpose. You may post updates to your Project so Donors know how their money is being used, and any other relevant information. If you are raising funds on behalf of someone else, you must ensure that all funds raised are given to or spent on behalf of that Beneficiary. By adding a Beneficiary, you agree to full transparency of the donations for your Project to the Beneficiary. When you organize a Project, you agree to follow all laws and regulations related to your Project, including but not limited to those about taxes and donations. If you are using personal data from anyone, including but not limited to their name, image or likeness, you must have their valid legal permission to share it with us and post it on the Services. You also agree not to provide or offer to provide goods or services in exchange for donations. We may share information about your Project with Donors, the Beneficiary, legal authorities, and as otherwise described in our Privacy Notice.`
              ],
              content2: [
                `(a) Maintaining Accurate Information: Keeping your registration details accurate and current is essential. This includes updating your name, address, and any images or videos you use to represent yourself, your organization, or your NGO. This helps maintain transparency and trust with Donors and ensures compliance with these Terms of Service and applicable legal requirements.`,
                `(b) You Agree to Cooperate: When you organize a Project on GivingBack, you agree to fully cooperate with any request for evidence that we deem necessary to verify your compliance with these Terms of Service. Our requests may include, but are not limited to, asking that you: (a) explain how funds were or will be handled; (b) supply documentary evidence of the circumstances described on your Project; (c) share the identity of any party receiving, benefitting from, or involved with handling all or any portion of the funds; (d) supply proof of how funds were or will be used; or (e) supply evidence that the intended third party Beneficiary consents to a plan for distribution of funds consistent with the description of your Project. We reserve the right to refuse, condition, suspend, freeze or ban any Donations, Accounts, Projects, Transfers or other transactions that we believe in our sole discretion may violate these Terms of Service or harm the interests of our Users, business partners, the public, or GivingBack, or that expose you, GivingBack, or others to risks unacceptable to us.`
              ]
            },
            {
              content: [
                `6.2. Donors: When you donate money on GivingBack, it’s your responsibility to understand how your donation will be used, and you donate at your own risk. Make sure to regularly check the Project’s page for any updates or new information. We are not responsible for what Organizers promise or offer in their Projects. We are also not responsible for verifying information that appears on Projects, nor do we guarantee that Donations will be used in accordance with any fundraising purpose prescribed by a User or Project. However, we take all reports of fraud or misuse of funds very seriously, and we will take appropriate action against any Project or User that violates our Terms of Service.`
              ],
              content2: [
                `(a) Making Donations: When you donate to a Project or NGO through GivingBack, you need to use a credit card or other payment method that is linked to your Account. You represent and warrant that your payment information is correct and that you are legally authorized to use your payment method. There may be a minimum amount you can donate, and once you donate your money will not be refunded. We use third party payment processors to process your donation. As explained further in Section 5 “Payment Processors”, by donating, you also agree to allow our payment processors to handle your payment information according to their rules and these Terms. For details on the companies we use for processing payments and their rules, please check the “Payment Processors” section above.
                                      `,
                `(b) Recurring Donations: By opting into recurring donations, you authorize GivingBack and its vendors to charge your designated payment method without further authorization from you. You agree that the donation amount you specify will be charged to your payment
                                      method at the frequency you select (e.g., monthly) until the earlier of (1) the Project ceasing to be a valid, active Project or (2) as soon as reasonably practical, after you elect to cancel this recurring donation.
                                      `,
                `(i)You may cancel your recurring donation at any time by contacting our Support Team or through the cancellation feature in your account as part of Services. Cancellation will take effect promptly upon receipt of your cancellation request, and no further donations will be processed after the cancellation date. However, any donations processed prior to your cancellation will not be refunded.
                                      `,
                `(c) Refunds and Disputes: If you believe that an error has occurred in any of your donations, please contact us immediately so we can help resolve the issue. Any fraud disputes or chargebacks initiated with your payment provider may be contested by us on the basis of this authorization.
`,
                `(d) Reporting Concerns: We take any reports of fraud or misuse of funds very seriously. If you have reason to believe that a User or Project is not raising or using the funds for their stated purpose, please click the “Report” link to alert our team of this potential issue and we will investigate.
`,
                `(e) No Restrictions When You Donate to NGOs: If you donate to an NGO you can’t decide exactly how your donation is used. Even if you donate for a specific project or tell the NGO how you’d like your donation used, these instructions are just suggestions. The NGO has the final say and can use all donations at their discretion.
`,
                `(f) Tax Implications of Donating to NGOs: When you donate to an NGO, you should talk to a tax advisor to understand if your donation is tax-deductible. GivingBack doesn’t withhold funds for tax purposes or otherwise, nor does GivingBack guarantee that your donations are tax-deductible or eligible for tax credits. GivingBack will also not be liable for any claims or penalties assessed by any tax authorities regarding how your donation is reported by you or a third party.
`,
                `(g) We share your Information with NGOs you Donate to: In certain cases, we may share your personal information (even if you’ve chosen to donate anonymously), with the NGO to which you donate, in accordance with our Privacy Notice. The NGO may use this information only for compliance and transactional purposes such as providing a donation receipt unless you expressly provide appropriate consent during the Donor checkout flow to allow the NGO to reach out to you. GivingBack isn’t responsible for how the NGO uses your information.
`,
                ,
                `6.3. NGOs: If you’re using the service to fundraise as an agent for an NGO or claiming or managing an account for an NGO on our Services, you represent and warrant that you are

authorized to do so and will follow all applicable laws. We may seek additional verification to confirm that you are authorized to act on behalf of the NGO as needed. Your NGO must be legally recognized as and continue to remain tax-exempt and registered with the appropriate authorities, like the FIRS in the Nigeria or the Canada Revenue Agency in Canada.
`,
                `(a) Payment via PayPal: Our platform do not currently accept or integrated with PayPal Payment processing gateway.
`,
                `(b) Adding or Claiming your NGO on the Services: Our Services may include public-facing pages providing information about NGOs and an authorized representative from the NGO will have the right to claim these pages and manage their presence on the Services.
`,
                `(c) Removing your NGO from GivingBack: If you’re an authorized representative of an NGO and you don’t want your NGO listed on GivingBack, you can ask us to remove your NGO from our database. Please send us an email to support@GivingBackNG.org with your full name, your job title, and your NGO’s email and phone number. Keep in mind, if we remove your NGO from our database, it won’t be able to receive donations through GivingBack anymore.
`,
                `(d) Receiving Funds: As an NGO, when you get donations, the total amount you actually receive will be reduced by the amount of our Transaction Fees, and subject to the applicable Payment Processor’s procedures and terms. GivingBack isn’t the one processing your payments or holding onto your funds.
`,
                `(e) Payment Processors for NGOs: GivingBack has partnered with Flutterwave or Stripe, for Donations to NGOs. Although exceptions can be made, NGOS in Nigeria will be defaulted to using the Flutterwave to process Donations made through the Services. The manner in which transactions are processed is explained below. NGOs in other countries will be defaulted to using Stripe.
`,
                `6.4. Tax Responsibilities for Organizers, NGOs and Beneficiaries: We do not withhold funds for tax purposes or otherwise. You, as an Organizer, Beneficiary, or NGO, are solely responsible for paying any applicable taxes in connection with any donations you receive. It’s up to you to calculate, report, and pay the correct amount of tax to the tax authorities.
`
              ]
            }
          ]
        },
        {
          title: '7. Transfers, Holds & Chargebacks',
          subContent: [
            {
              content: [
                `7.1. Transfers: While we strive to make Transfers available to you promptly, our ability to do so is dependent upon Users providing the right information and upon our technical systems operating as intended. You acknowledge and agree that: (i) Transfers may not be
available to you for use immediately; (ii) we do not guarantee that Transfers will be always available to you within any specific time frame, but we will use commercially reasonable efforts to provide Transfers as soon as reasonably possible; (iii) you will cooperate with any request we make for evidence we deem necessary to verify your compliance with these Terms of Service; and (iv) to the extent permitted by applicable law, we expressly disclaim any and all responsibility for any delay in Transfers or your inability to access and use donated funds at any specified time, and any consequences arising from such delay or inability. We will use commercially reasonable efforts to let you know when you can expect to receive the Transfer and to provide a clear timeframe whenever possible.
`,
                `(a) You must provide accurate info: You, as an Organizer and/or Beneficiary, are responsible for (i) verifying your personal information and bank account information under “Set up transfers” as soon as possible; and (ii) ensuring that the information you provide to GivingBack and/or its Affiliates in order to process a Transfer, including bank account information, is accurate and up to date.
`,
                `(b) Refunds: We may, without notice and in our sole discretion, offer or issue a refund of Donation(s), which may comprise the entire amount donated to your Project. To the extent permitted by applicable law, we are not liable to you or to any third party for any claims, damages, costs, losses, or other consequences caused by us issuing refunds, including, but not limited to transaction or overdraft fees.
`,
                `(c) Transfer Funds within 120 Days: Our payment processors are not able to hold funds indefinitely. If you do not Transfer your donations to your bank account within one hundred and twenty (120) days of your first donation, our payment processors may, in accordance with relevant laws and regulations, refund or escheat any funds raised. You will be responsible for working with the appropriate governmental authority to claim any escheated funds.
`,
                `7.2. Transfer Holds: We may, in our sole discretion, place a hold on a Project, restrict Transfers, initiate a reverse ACH Transfer, secure reserves, or take similar actions to protect our Users (any of these actions may be referred to as a “Hold”). We may put a Hold on your Project or Account for several reasons, including but not limited to:
`,
                `(a) We need more information to verify that your Project complies with our Terms of Service, or we have determined that a Project or User has violated our Terms of Service;
`,
                `(b) Our determination that the funds should be provided directly to a person other than the Organizer, such as a legal Beneficiary or person entitled by law to act on behalf of an Organizer;
`,
                `(c) We have identified activity on your Project that introduces risks unacceptable to us;

`,
                `(d) Such action is required to comply with a court order, injunction, writ, or as otherwise required under applicable law and regulations.
If you have questions about a Hold we may have placed on your Project or Account, or need information about how to resolve the Hold, please click on Hold to contact us for more detail information
`,
                `7.3. Payment Processor Chargebacks: Occasionally, a Donor may dispute a credit card charge for a Donation through the Services. In situations where the Cardholder is not alleging that a fraudulent donation has been made (i.e. that the transaction was not made by the cardholder), the Cardholder should always attempt to resolve the dispute with the Organizer or with us before pursuing a chargeback.
We will review each chargeback request to determine whether the chargeback is legitimate, and if we determine a chargeback is not legitimate, we may use information submitted by you and/or at our disposal at the time of donation to defend that chargeback. Further, we will defend any non-fraud chargeback with such reason codes as Merchandise / Services Not Received or any other code that suggests non-delivery, as transactions processed on GivingBack are donations without the expectation or exchange of goods or services.
If a Donor disputes their transaction with their card issuer, or if the card issuer disputes the transaction on behalf of the cardholder and it becomes a chargeback, the Donor surrenders, without limitation, any benefits or protections of the GivingBack Giving Guarantee related to that Donation.
`
              ]
            }
          ]
        },
        {
          title: `8. Prohibited Projects and Related User Content`,
          subContent: [
            {
              content: [
                `This Section includes our rules about prohibited and/or illegal Projects and User Content. We may remove any User Content–including any Projects–that we determine violates these Terms of Service. Further, if you violate these Terms of Service, we may ban or disable your use of the Services, stop payments to any Project, freeze or place a hold on donations and Transfers, report you to law enforcement authorities, or take any other appropriate legal action.
We may investigate a Project, a User or User Content at any time to ensure compliance with these Terms of Service. In doing so, we may consider all available material, including but not limited to social media, related news, and any other information that we deem relevant in our review. Please note that while we reserve the right to remove, edit, or modify any content on our Platform at our sole discretion, we are not obligated to do so. This includes content that is illegal, inaccurate, misleading, infringes on intellectual property rights, or violates these Terms of Service.

You agree that you will not use the Services or Platform to raise funds or establish any Project for the purposes of promoting or involving:
`,
                `8.1. the violation of any law, regulation, industry requirement, or third-party guidelines or agreements by which you are bound, including those of payment card providers that are utilized in connection with the Services;
`,
                `8.2. Projects that are fraudulent, misleading, inaccurate, dishonest or impossible;
`,
                `8.3. offensive, graphic, perverse or sexual content;
`,
                `8.4. the funding of a ransom, human trafficking or exploitation, vigilantism, bribes or bounty;
`,
                `8.5. purchase or use by an organization or individual of drugs, narcotics, steroids, controlled substances, pharmaceuticals or similar products or therapies that are either illegal, or prohibited at the state or national level;
`,
                `8.6. activities with, in, or involving countries, regions, governments, persons, or entities that are subject to other economic sanctions under applicable law, unless such activities are expressly authorized by the appropriate governmental authority and by our payment service providers;
`,
                `8.7. any equipment or weapons meant for use in conflict or by an armed group, explosives, ammunition, firearms, knives, or other weaponry or accessories;
`,
                `8.8. any activity in support of terrorism, extremism, hate, violence, harassment, bullying, discrimination, terrorist financing, extremist financing, or money laundering;
`,
                `8.9. User Content that reflects, incites or promotes bullying, harassment, discrimination, or intolerance of any kind relating to race, ethnicity, national origin, religious affiliation, sexual orientation, sex, gender, gender identity, gender expression, disabilities or diseases;
`,
                `8.10. the legal defense of financial and violent crimes, including those related to money laundering, murder, robbery, assault, battery, sex crimes or crimes against minors;
`,
                `8.11. User Content that promotes self-harm or suicide except as permitted by law in a clinical setting;
`,
                `8.12. gambling, gaming and/or any other activity with an entry fee and a prize including, but not limited to raffles, casino games, sports betting, fantasy sports, horse or greyhound racing, lottery tickets, raffle tickets, auctions and other ventures that facilitate gambling, games of skill or chance (whether or not it is legally defined as a lottery), promotions

involving rewards (monetary or otherwise) in exchange for donations, including event tickets, raffle entries, meet-and-greet opportunities, gift cards or sweepstakes;
`,
                `8.13. any activity that disguises, conceals, or otherwise obscures the origin of funds;
`,
                `8.14. annuities, investments with the expectation of a return, loans, equity or lottery contracts, lay-away system, off-shore banking or similar transactions, money service businesses (including currency exchanges, check cashing or the like), pyramid schemes, “get rich quick schemes” (i.e., investment opportunities or other services, that promise high rewards), network marketing and referral marketing programs, debt collection or crypto-currencies;
`,
                `8.15. the receipt or grant of cash advances or lines of credit to yourself or to another person for any reason, including but not limited to self payments, or payments for which there is no apparent purpose;
`,
                `8.16. products or services that directly infringe or facilitate infringement upon the trademark, patent, copyright, trade secrets, or proprietary or privacy rights of any third party, including but not limited to counterfeit music, movies, software, or other licensed materials without the appropriate authorization from the rights holder;
`,
                `8.17. the sale or resale of goods or services;
`,
                `8.18. electoral fundraising unless the Project is directly managed by the candidate or their committee; any election Project in an unsupported country unless run by a registered organization within a supported country;
`,
                `8.19. any attempt to bypass or otherwise circumvent payment processing rules and regulations, or these Terms of Service;
`,
                `8.20. any activity that presents GivingBack with an unacceptable risk of financial loss;
`,
                `8.21. any other activity that GivingBack may deem, in its sole discretion, to: (a) be unacceptable or objectionable; (b) restrict or inhibit any other person from using or enjoying the Services; or (c) expose GivingBack, its employees or Users to any harm or liability of any type.
`
              ]
            }
          ]
        },
        {
          title: `9. Prohibited User Conduct`,
          content: `This Section includes our rules about User Conduct that is prohibited and/or illegal. We may remove any User Content–including any Projects–if we determine that a relevant User has engaged in User Conduct that violates these Terms of Service. Further, if you violate these Terms of Service, we may ban or disable your use of the Services, stop payments to

any Project, freeze or place a hold on donations and Transfers, report you to law enforcement authorities, or otherwise take appropriate legal action.
By using the Services or our Platform, you agree:`,
          subContent: [
            {
              content: [
                `9.1. not to use the Services to transmit or otherwise upload any User Content that: (i) infringes any intellectual property or other proprietary rights of any party; (ii) you do not have a right to upload under any law or under contractual or fiduciary relationships; (iii) contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment; (iv) poses or creates a privacy or security risk to any person; or (v) constitutes unsolicited or unauthorized advertising, promotional materials, commercial activities and/or sales, “junk mail,” “spam,” “chain letters,” “pyramid schemes,” “contests,” “sweepstakes,” or any other form of solicitation;
`,
                `9.2. not to interfere with or disrupt servers or networks connected to or used to provide the Services or their respective features, or disobey any requirements, procedures, policies or regulations of the networks connected to or used to provide the Services;
`,
                `9.3. not to harvest, collect, scrape or publish personally identifiable information of others;
`,
                `9.4. not to raise funds for a minor without the express permission of the minor’s guardian unless the funds are Transferred into a trust account for the sole benefit of the minor;
`,
                `9.5. not to use the Services on behalf of a third party or post any personal data or other information about a third party, without the express consent of that third party;
`,
                `9.6. not to use another User’s Account or URL without permission, impersonate any person or entity, falsely state or otherwise misrepresent your affiliation with a person or entity, misrepresent an NGO or Project through the Services, or post User Content in any inappropriate category or areas on the Services;
`,
                `9.7. not to create any liability for GivingBack or cause us to lose (in whole or in part) the services of our Internet Service Provider(s), web hosting company or any other vendors or suppliers;
`,
                `9.8. not to gain unauthorized access to the Services, or any account, computer system, or network connected to the Services, by any unauthorized or illegal means;
`,
                `9.9. not to obtain or attempt to obtain any materials or information not intentionally made available through the Services;
`,
                `9.10. not to use the Services to post, transmit or in any way exploit any information, software or other material for commercial purposes, or that contain advertising, except

that using the Services for fundraising activities in accordance with these Terms of Service is expressly permitted;
`,
                `9.11. not to transmit more request messages through the Services in a given period of time than a human can reasonably produce in the same period by using a conventional online web browser;
`,
                `9.12. not to undertake any activity or engage in any conduct that is inconsistent with the business or purpose of the Services;
`,
                `9.13. not to share your password or login credentials with anyone for any reason;
`,
                `9.14. not to make or accept any Donations that you know or suspect to be erroneous, suspicious or fraudulent;
`,
                `9.15. not to use the Services in or for the benefit of a country, organization, entity, or person embargoed or blocked by any government, particularly those on sanctions lists as identified in your country;
`,
                `9.16. not to attempt to undertake indirectly any of the foregoing.
`,
                `9.17. to maintain reasonable and standard security measures to protect any information transmitted and received through the Services, including without limitation, adhering to any security procedures and controls required by GivingBack from time to time;
`,
                `9.18. to maintain a copy of all electronic and other records related to Projects and Donations as necessary for GivingBack to verify compliance with these Terms of Service and make such records available to GivingBack upon our request. For clarity, the foregoing does not affect or limit your obligations to maintain documentation as required by applicable laws, rules, regulations, or governmental authority; and
`,
                `9.19. at GivingBack’s request, to cooperate as far as reasonably possible and permitted under applicable law, in the auditing of, investigation of (including without limitation, investigations by GivingBack, a Payment Processor, or a regulatory or governmental authority), and remedial efforts to correct any alleged or uncovered violation or wrongdoing of a User to whom, or Project or Donation to which, you are connected.
`
              ]
            }
          ]
        },
        {
          titile: `10. Content Moderation and Reporting Projects`,
          content: `If you have reason to believe that a Project contains illegal content or content that violates these Terms of Service or our content moderation policies, please use the “Report” to alert our team of this potential issue and we will investigate. If you disagree with a decision taken by us in connection to a notice or complaint related to User Content and/or use of

the Platform that is illegal or prohibited by GivingBack, you may use our available dispute resolution systems.
We leverage a combination of business rules, machine learning, and human review to identify and remediate violations of our Terms of Service. You acknowledge that rules in this section concerning content moderation are without prejudice to policies/procedures available in regulating how we moderate User Content, how we protect individuals from illegal content, the process for reporting or appealing violations, the process for handling and resolution of complaints and the dispute resolution systems available.
`
        },
        {
          title: `11. Fees`,
          subContent: [
            {
              content: [
                `11.1. We Don’t Charge a Platform Fee: A Platform fee is an upfront, calculated charge, either fixed or percentage-based, for accessing or using a specific service on a Platform. We do not charge a Platform fee, and we do not charge to start or maintain a Project. However, a Transaction Fee does apply to donations received and, if donors choose recurring donations, we charge donors a Recurring Fee on each donation.
`,
                `11.2. A Transaction Fee Is Charged on All Donations and A Recurring Fee is Charged for Recurring Donations: A Transaction Fee is the cost of processing a payment. Although there are no Platform fees to start or maintain a Project, please keep in mind that a Transaction fee, including credit and debit charges, is deducted from each donation by our Payment Processors to securely deliver your donations. If donors choose recurring donations, we charge donors a Recurring Fee per donation to the selected Project.
`
              ]
            }
          ]
        },
        {
          title: `12. Intellectual Property Rights, Content Ownership and Licenses`,
          subContent: [
            {
              content: [
                `12.1. Ownership and intellectual property: You acknowledge that the Services Content are protected under laws related to copyright, patent, trademark, and other proprietary rights. The technology and Software that support the Services, or are distributed in connection with them, are owned by GivingBack, our Affiliates, and our partners.
`,
                `12.2. Use of GivingBack Trademarks: The GivingBack name and logos are trademarks of GivingBack and its Affiliates (collectively the “GivingBack Trademarks”). Other company, product, and service names and logos displayed on our Services or Platform may be trademarks of their respective owners, who may or may not be affiliated with us. Nothing in these Terms of Service or our Services gives you permission to use any GivingBack Trademarks without our prior written consent. All goodwill generated from the use of GivingBack Trademarks benefits us exclusively.
`,
                `12.3. Do Not Misappropriate Content on our Site: You agree not to alter, copy, frame, scrape, rent, lease, loan, sell, distribute, or create derivative works based on the Services

or the Services Content. You agree not to use any data mining, spiders, robots, scraping, or similar data gathering or extraction methods to extract or copy any of the Services Content in any form or otherwise in connection with your use of the Services. If we block your access to the Services (including blocking your IP address), you agree not to bypass this blocking (for example, by masking your IP address or using a proxy IP address). Any rights not expressly granted herein by us are reserved.
`,
                `12.4. Do Not Misappropriate our Software: You are prohibited from copying, modifying, creating derivative works of, reverse engineering, disassembling, or attempting to discover any source code of the Software or the Services in any form.
`,
                `12.5. Rights and Permissions for User Content You Share: When you share content through our Services, you represent and warrant that you either own the content or have permission to use and share it. This includes all related copyrights, trademarks, and rights to privacy or publicity. When you upload, share, or make any User Content available in connection with the Services, you grant GivingBack and its Affiliates the worldwide, royalty free, transferable, sublicensable, perpetual, irrevocable license to copy, display, distribute, store, modify, publish, prepare derivative works, or otherwise use that User Content for any purpose, including, with your prior consent, for the promotion, advertisement or marketing of our Services in any form of media. You further acknowledge that your participation in the Services and submission of User Content is voluntary and that you will not receive financial compensation of any type associated with the licenses, waivers, and releases set forth herein (or GivingBack’s exploitation thereof), and that the sole consideration for subject matter of this agreement is the opportunity to use the Services.
`,
                `12.6. Release and Waiver of Rights in User Content: When you post any User Content and to the maximum extent permitted by law, you irrevocably waive any moral rights in your User Content against us and our Users, and agree to release and hold harmless GivingBack, our contractors and our employees from (i) any claims for invasion of privacy, publicity or libel; (ii) any liability from the use of your name, image, or likeness, including blurring, distortion, alteration or other uses; and (iii) any liability for claims made by you related to your User Content, name, image or likeness. By posting User Content, you also waive any right to inspect or approve any intermediary or finished versions of your User Content. If your User Content includes anyone other than yourself, you represent and warrant that you have obtained all necessary permissions, waivers, and releases from those individuals. This ensures that GivingBack can use the content as described above without any legal issues.
`,
                `12.7. User Suggestion and Feedback: Any content or information you provide to GivingBack, whether solicited or not, may be publicly accessible. This includes any

information you post on forums, in comment sections, surveys, customer support communications, or any other submissions such ideas, suggestions or feedback about the Services (“Suggestion and Feedback”). By submitting any Suggestion or Feedback, you agree that (i) we have no obligation to keep Suggestion or Feedback confidential; (ii) we may already have similar information under consideration or development; (iii) we can use and distribute Suggestion and Feedback for any purpose, without acknowledgement or compensation to you; (iv) you have all necessary rights to submit such Suggestion and Feedback; (v) you grant GivingBack a perpetual, worldwide, royalty-free, irrevocable, non-exclusive, and fully transferable license to use, reproduce, perform, display, distribute, adapt, modify, re-format, create derivative works of, and otherwise exploit other information, including the right to sublicense these rights; and (vi) You waive any moral rights or equivalent claims to the extent permitted by law. This section remains effective even after your Account or use of the Services is terminated.
`,
                `12.8. Copyright or Trademark Complaints: We respect the intellectual property of others, and we ask that our Users do the same. We will process and investigate notices of alleged copyright or trademark infringement and take appropriate action under the Digital Millennium Copyright Act (“DMCA”) or other locally equivalent intellectual property laws. In our sole discretion, we may terminate the Accounts of any Users who infringe on others’ intellectual property rights
(a) Takedown Notice: If you believe that your work appears on our site in a way that constitutes copyright infringement, or that your intellectual property rights have otherwise been violated, you must notify us in writing, as follows:
Email our copyright agent at legal@GivingBackNG.org with the subject line (“DMCA Takedown Request”),
To be effective, your Takedown Notice must contain the following information:
`
              ],
              list: [
                `Your complete contact information (full name, mailing address and phone number). Please note that we may provide your contact information to the person who posted the content you are reporting. For this reason, you may wish to provide a professional or business email address;
`,
                `a description of the copyrighted work that you claim has been infringed;
`,
                `A description of the contention on our site that you claim infringes your copyright;
`,
                `a description of where the material that you claim is infringing is located on the Services. The easiest way to do this is by providing web addresses (URLs) leading directly to the allegedly infringing content.

`,
                `A declaration that:
`,
                `You have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;
`,
                `The information in your notice is accurate; and
`,
                `Under penalty of perjury, you are the owner or authorized to act on behalf of the owner of an exclusive copyright that is allegedly infringed.
`,
                `Your electronic or physical signature.
`
              ]
            }
          ]
        },
        {
          subContent: [
            {
              content: [
                `(b) Counter-Notice: If you believe that your User Content that was either removed or disabled is non-infringing or that you have authorization from the owner, the owner’s agent, or pursuant to the law, to upload and use such content, you may send us a counter-notice to our copyright agent at Legal@GivingBackNG.org or the address listed above.
`,
                `To be effective, your counter-notice must include the following information:
`
              ],
              list: [
                `Your complete contact information (full name, mailing address and phone number). Please note that we may provide your contact information to the person who complained about your content. For this reason, you may wish to provide a professional or business email address;
`,
                `identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;
`,
                `A declaration that:
`,
                `You have a good-faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content;
`,
                `You consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located. If you are outside the United States, you must consent to the jurisdiction of any Federal District court in any judicial district in which GivingBack operates; and
`,
                `You will accept service of process from or on behalf of the person who provided the DMCA takedown notice, or an agent of such person.
`,
                `Your physical or electronic signature.
`
              ],
              content2: [
                `If we receive a counter-notice, we will send a copy of the counter-notice to the original complaining party, informing that person that we may replace the removed content or

cease disabling it in 10 business days. Unless the original complaining party files an action seeking a court order against the content provider or User, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the counter-notice.
`
              ]
            }
          ]
        },
        {
          title: `13. Data Privacy and Artificial Intelligence`,
          subContent: [
            {
              content: [
                `13.1. Privacy Notice: At GivingBack, we respect the privacy of our Users. For details, please see our Privacy Notice. By using the Services, you acknowledge our collection, use and sharing of personal data as outlined therein.
`,
                `13.2. Retention of Project Data: We are not obligated to retain data related to any Account or Project after its conclusion. We may delete historical data or terminate inactive Accounts without notice, except for any data we must keep to comply with legal obligations or to establish, exercise or defend legal claims. When possible, we will try to provide NGOs with reasonable notice before deleting Accounts or data tied to them.
`,
                `13.3. Understanding Public Visibility and Privacy Settings: Some things you do on our Platform are public, like the posts you make and the material you upload (this could be anything from descriptions, photos, videos, comments, to music and logos). Also, the profile information you provide (like your name, organization, and biography) can be seen by other Users to help people connect within the Service. If you’re donating, you can choose to show your donation publicly, meaning anyone on the internet, including search engines like Google, can see it. If you want to keep your donation private, just check the “Don’t display my name publicly on the Project” box when you donate. Keep in mind, the Project Organizer, their team, the Beneficiary and others will still see your information according to our Privacy Notice.
`,
                `13.4. Third-Party Communications: When using our Services to communicate with third parties (e.g., referring someone or discussing a Project or Donation), you (i) confirm you have the authority and necessary consents from the third party to share their data with us and that you have informed them about how their information will be collected and used by GivingBack; and (ii) agree that we may identify you as the person who made the referral in any messages sent to the third party. You also agree that we may use such data to contact the third party or provide you with a template message to facilitate communication and that we may send reminders or related messages to you and the third party.
`,
                `13.5. Artificial Intelligence: We’re constantly developing new technologies and features to improve our Services. For example, we may enable you to use artificial intelligence developed by us and/or our vendors to make it easier for you to write, create assets or other content and promote your use of our Services such as helping you draft posts or create

photos or videos to share your campaigns, or for optimizing the use of our Services such as connecting donor to project. Use of such features is optional, offered solely as a convenience to you, and such features are offered on an as-is basis with no warranties of any kind. Any output generated by use of any such Services enabled by artificial intelligence and machine learning is probabilistic and should be evaluated for accuracy as appropriate for your use case, including by employing human review of such output. It is also possible that output through the use of large language models is not always unique across customers and the Services may generate the same or similar results across multiple Users.
`
              ]
            }
          ]
        },
        {
          title: `14. Third-Party Services and Content`,
          content: `14.1. Other Third Party Websites/Links/Services. Our Services may rely on, or certain third parties may include in our Services links to, certain Third Party Resources. We have no control over such Third Party Resources and do not endorse or otherwise take any responsibility for such Third Party Resources. By using our Services, you agree that we are not liable for the content, functions, accuracy, or legality of these Third Party Resources, or any damages or loss that may be caused by these Third Party Resources. In certain situations, Third Party Resources may include products or services offered by a third party that you may display or are otherwise made available through the Services and if so, you may be subject to third-party terms associated with such Third Party Resources. GivingBack has relationships with certain providers of such products and services, and we may be paid by such providers in the form of commissions in connection with these products and services.
`
        },
        {
          title: `15. Suspension or Termination of Accounts`,
          subContent: [
            {
              content: [
                `You agree that we may, in response to concerns of fraudulent or illegal activity or a material breach of these Terms of Service, suspend or terminate your Account (or any part thereof) or your access to the Services and remove and discard any User Content or data at any time, including any Projects you may have organized. To the extent permitted by applicable law, we may take any such actions without any liability to you or to any third party for any claims, damages, costs or losses resulting therefrom. We may take such actions with or without providing you notice.
`,
                `15.1. Account Closures: We reserve the right, without limitation, to close your Account or disable your access to the Services in any of the following circumstances: (i) we are unable to confirm that your Project complies with these Terms of Service; (ii) we are unable to support your Account from a technical perspective; (iii) our payment processors are unable to support your Account; (iv) the Beneficiary requests that the Project is removed; (v) your

Account becomes dormant or otherwise abandoned; (vi) your Account displays activity that poses a risk to GivingBack or its community; or (vii) such action(s) is required to comply with a court order, writ, injunction, or as otherwise required under applicable laws and regulations.
`
              ]
            }
          ]
        },
        {
          title: `16. Disclaimers and Limitations of Liability`,
          subContent: [
            {
              content: [
                `16.1. Warranty Disclaimer: YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. TO THE EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. EACH OF GIVINGBACK AND ITS AFFILIATES EXPRESSLY DISCLAIM AND EXCLUDE, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ALL WARRANTIES, CONDITIONS AND REPRESENTATIONS OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
WITHOUT PREJUDICE TO STATUTORY WARRANTIES UNDER APPLICABLE LAW, AND WITHOUT PREJUDICE TO CONTENT MODERATION REQUIREMENTS WHERE PRESCRIBED BY APPLICABLE LAW, NEITHER GIVINGBACK NOR ANY OF ITS AFFILIATES MAKE ANY WARRANTY OR CLAIM THAT: (I) THE SERVICES WILL MEET YOUR REQUIREMENTS; (II) THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE; OR (IV) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICES WILL MEET YOUR EXPECTATIONS.
ALL THIRD-PARTY INFORMATION AND CONTENT ON THE SERVICES ARE FOR INFORMATIONAL PURPOSES ONLY. GIVINGBACK AND ITS AFFILIATES DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, TIMELINESS, OR RELIABILITY OF THIS INFORMATION. NO CONTENT IS INTENDED TO PROVIDE FINANCIAL, LEGAL, TAX, OR OTHER PROFESSIONAL ADVICE. BEFORE MAKING DECISIONS ABOUT PROJECTS, NGOS, DONATIONS, OR ANY RELATED INFORMATION, CONSULT WITH YOUR FINANCIAL, LEGAL, TAX, OR OTHER PROFESSIONAL ADVISOR. YOU ACKNOWLEDGE THAT YOU ACCESS ALL INFORMATION AND CONTENT ON THE SERVICES AT YOUR OWN RISK.
WE DO NOT GUARANTEE THAT ANY PROJECT WILL RECEIVE A SPECIFIC AMOUNT OF DONATIONS OR ANY DONATIONS AT ALL. WE DO NOT ENDORSE ANY PROJECT, USER, OR CAUSE, AND WE MAKE NO GUARANTEES ABOUT THE ACCURACY OF INFORMATION PROVIDED THROUGH THE SERVICES. AS A DONOR, YOU MUST DETERMINE THE VALUE AND APPROPRIATENESS OF CONTRIBUTING TO ANY USER OR PROJECT.

`,
                `16.2. LIMITATION OF LIABILITY: YOU EXPRESSLY UNDERSTAND AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER GIVINGBACK NOR ANY OF ITS AFFILIATES WILL BE LIABLE FOR ANY: (I) INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE OR EXEMPLARY DAMAGES; (II) DAMAGES FOR LOSS OF PROFITS; (III) DAMAGES FOR LOSS OF GOODWILL; (IV) DAMAGES FOR LOSS OF USE; (V) LOSS OR CORRUPTION OF DATA; OR (VI) OTHER INTANGIBLE LOSSES (EVEN IF GIVINGBACK HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, RESULTING FROM: (A) THE USE OR THE INABILITY TO USE THE SERVICES; (B) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA, INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED OR TRANSACTIONS ENTERED INTO THROUGH OR FROM THE SERVICES; (C) ANY PROMOTIONS AND RELATED PRIZES OR REWARDS MADE AVAILABLE THROUGH THE SERVICES; (D) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (E) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SERVICES; OR (F) ANY OTHER MATTER RELATING TO THE SERVICES. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL GIVINGBACK’S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES (INCLUDING CONTRACT, NEGLIGENCE, STATUTORY LIABILITY OR OTHERWISE) OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID GIVINGBACK IN THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE HUNDRED U.S. DOLLARS (US$100).
YOU AGREE THAT NEITHER GIVINGBACK NOR ANY OF ITS AFFILIATES SHALL BE LIABLE IN ANY WAY FOR ANY CONTENT OR MATERIALS OF ANY THIRD PARTIES (INCLUDING USERS) OR ANY USER CONTENT (INCLUDING, BUT NOT LIMITED TO, FOR ANY ERRORS OR OMISSIONS IN ANY USER CONTENT), OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY SUCH USER CONTENT. YOU ACKNOWLEDGE THAT GIVINGBACK DOES NOT PRE-SCREEN ALL USER CONTENT, BUT THAT GIVINGBACK AND ITS DESIGNEES WILL HAVE THE RIGHT (BUT NOT THE OBLIGATION) IN THEIR SOLE DISCRETION TO REFUSE, REMOVE, OR ALLOW ANY USER CONTENT THAT IS AVAILABLE VIA THE SERVICES AT ANY TIME AND FOR ANY REASON, WITH OR WITHOUT NOTICE, AND WITHOUT ANY LIABILITY TO YOU OR TO ANY THIRD PARTY FOR ANY CLAIMS, DAMAGES, COSTS OR LOSSES RESULTING THEREFROM. WE EXPRESSLY DISCLAIM ANY LIABILITY FOR THE OUTCOME OR SUCCESS OF ANY PROJECT.
SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SERVICES OR WITH

`,
                `THESE TERMS OF SERVICE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SERVICES.
`
              ]
            }
          ]
        },
        {
          title: `17. Indemnification and Release`,
          content: `17.1. Obligations of Users to Indemnify GivingBack against certain types of claims: To the fullest extent permitted by applicable law, You agree to release, indemnify and hold GivingBack and its Affiliates and their officers, employees, directors and agents harmless from any and all losses, damages, expenses (including reasonable attorneys’ fees), costs, awards, fines, claims, and actions of any kind, arising out of or relating to your use of the Services, any Donation or Project, any User Content, your connection to the Services, your violation of these Terms of Service or your violation of any rights of another. You agree that GivingBack has the right to conduct its own defense of any claims at its own discretion, and that you will indemnify GivingBack for the costs of its defense.
`
        },
        {
          title: `18. Dispute Resolution & Arbitration`,
          subContent: [
            {
              content: [
                `18.1. USERS IN THE UNITED STATES AND ANYWHERE ELSE IN THE WORLD EXCEPT FOR THE EUROPEAN ECONOMIC AREA, THE UK AND SWITZERLAND:
            PLEASE READ THIS SECTION CAREFULLY BEFORE USING THE SERVICES OR PLATFORM AS THIS AGREEMENT AFFECTS YOUR LEGAL RIGHTS AND GOVERNS HOW CLAIMS THAT YOU AND WE MAY HAVE AGAINST EACH OTHER ARE RESOLVED. This Agreement requires you to arbitrate disputes with GivingBack and limits the manner in which you can seek relief. This Agreement limits certain legal rights, including the right to a jury trial, the right to participate in any form of class, collective, or representative claim, dispute or action, and the right to certain remedies and forms of relief. Other rights that we or you would have in court, such as an appellate review, also may not be available in the arbitration process described within this section.
            `,
                `(a) Informal Resolution: You and GivingBack agree that good-faith informal efforts to resolve disputes can often result in a prompt, low-cost and mutually beneficial outcome. In the unlikely event that a disagreement arises between you and GivingBack regarding any claim or controversy at law or equity arising out of, relating to, or connected in any way with the Services or the Platform (collectively, “Dispute”), prior to initiating any legal action, you must first contact us directly by email at gfmlegal@GivingBackNG.org. You must provide your name, the email address associated with your GivingBack account (if any), a description of the Dispute and the specific relief sought.
            You agree that the term “Dispute” in these Terms of Service will have the broadest meaning possible. These Terms DO NOT cover any Dispute between you and any officer, director, board member, agent, employee, or third party. This includes any Disputes arising out of or
            
            relating to your relationship with us, including without limitation, disputes related to these Terms of Service or the breach, termination, enforcement, interpretation or validity thereof, your use of the services, and/or any rights of privacy and/or publicity.
            During the 60 days from the date you first contacted us, you and we agree to engage in good faith efforts to resolve the Dispute. You will not initiate any legal action during this period. At a minimum, we will personally meet and confer, via telephone or videoconference as part of an informal dispute resolution conference. If you are represented by counsel, your counsel may participate in the conference, but you shall also fully participate in the conference. An extension of time may be mutually agreed upon by you and us.
            Engaging in an informal dispute resolution conference is a requirement that must be fulfilled before commencing arbitration or legal action.
            `,
                `(b) Binding Arbitration Agreement & Class Action Waiver: YOU AND GIVINGBACK AGREE THAT ANY DISPUTE ARISING OUT OF OR RELATED TO THIS AGREEMENT OR OUR SERVICES IS PERSONAL TO YOU AND GIVINGBACK. YOU AND GIVINGBACK AGREE THAT ANY DISPUTE, CLAIM OR CONTROVERSY MUST BE ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A CLASS OR COLLECTIVE BASIS AND NOT IN A COURT OF LAW. YOU AND WE HEREBY EXPRESSLY WAIVE ANY RIGHTS TO SUE IN COURT AND RECEIVE A TRIAL BY JUDGE OR JURY OR TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING. The arbitrator, and not any federal, state or local court or agency, shall have exclusive authority to resolve any dispute relating to the interpretation, applicability, enforceability or formation of this Arbitration Agreement, including, but not limited to any claim that all or any part of this Arbitration Agreement is void or voidable. The arbitration proceedings and arbitration outcome are subject to certain confidentiality rules, and judicial review of the arbitration outcome is limited. Discovery and rights to appeal in arbitration are generally more limited than in a lawsuit, and other rights that you and we would have in court may not be available in arbitration. The arbitrator’s award shall be final and binding and may be entered as a judgment in any court of competent jurisdiction. This Agreement to arbitrate such disputes, claims or controversies shall be referred to herein as the “Arbitration Agreement”.
            Notwithstanding the foregoing, the Arbitration Agreement shall not require arbitration of the following Disputes: (i) qualifying individual Disputes in small claims court, so long as such individual action remains in such small claims court and advances only on an individual (non-class, non-representative) basis; (ii) an enforcement action through the applicable federal, state, or local agency if that action is available; or (iii) injunctive or other equitable relief in a court of competent jurisdiction for any dispute related to the actual or
            
            threatened infringement or other misuse of intellectual property rights (such as trademarks, trade dress, domain names, trade secrets, copyrights and patents).
            `,
                `(c) Arbitration Process, Rules, and Forum: You and GivingBack agree that the terms of this Arbitration Agreement are governed by the country Federal Arbitration Act in all respects.
            If the party requesting arbitration is represented by counsel, the Arbitration Demand shall also include counsel’s name, telephone number, mailing address and email address. Counsel must also sign the Arbitration Demand. By signing the request, counsel certifies to the best of counsel’s knowledge, information, and belief, formed after an inquiry reasonable under the circumstances, that (1) the Arbitration Demand is not being filed for any improper purpose, such as to harass, cause unnecessary delay, or needlessly increase the cost of dispute resolution; (2) the claims, defenses and other legal contentions are warranted by existing law or by a nonfrivolous argument for extending, modifying, or reversing existing law or for establishing new law; and (3) the factual and damages contentions have evidentiary support or, if specifically so identified, we will likely have evidentiary support after a reasonable opportunity for further investigation or discovery.
            `,
                `(d) Arbitration Fees: Your responsibility to pay any Arbitration filing fees, case management fees and arbitrator compensation will be solely as set forth in the Arbitration Authority Rules.
            `,
                `(e) Mass Arbitrations: In the event 25 or more Arbitration Demands of a similar nature are filed against GivingBack, where representation of all parties is consistent or coordinated across the cases, the country Arbitration Authority Rules for Mass Arbitration shall apply.
            `,
                `(f) Confidentiality: We each agree to keep any informal dispute and arbitration proceedings confidential, including all information exchanged between us and any settlement offers, unless otherwise required by law or requested by law enforcement or any court or governmental body. However, we may each disclose these matters, in confidence, to our respective attorneys, accountants, auditors, and insurance providers.
            `,
                `(g) Enforceability: If any provision of these Terms of Service or this Dispute Resolution section is found to be unenforceable, illegal or invalid for any reason, such unenforceability, illegality or invalidity will not affect any other provision of these Terms of Service or this Dispute Resolution section, and these Terms of Service and this Dispute Resolution section will be construed as if such unenforceable, illegal or invalid provision had never been contained therein.
            `,
                `(h) Opt Out: You may opt out of this Arbitration Agreement. To opt out, you must notify GivingBack in writing no later than 30 days after first becoming subject to this Arbitration
            
            `,
                `Agreement including any updates to the Arbitration Agreement. Your notice must include your name and address, the title of and link to your GivingBack campaign (if any), the email address you use to access your GivingBack account (if you have one), and a CLEAR statement that you want to opt out of this Arbitration Agreement. You must send your opt-out notice to
            gfmlegal@GivingBackNG.org with the subject line “Arbitration Opt-Out Notice”. If you opt out of this Arbitration Agreement, all other parts of these Terms of Service will continue to apply to you. GivingBack will continue to honor the valid opt outs of users who validly opted out of the Arbitration Agreement in a prior version of the Terms of Service.
            `,
                `(i) Time Period for Claims: You agree that any claim or cause of action arising out of or related to use of the Services, the Platform or these Terms of Service must be filed within one (1) year after such claim or cause of action arose or otherwise will be forever barred, which means that you and GivingBack will not have a right to assert the Claim.
            `,
                `18.2. Disputes With Other Users: You agree that you are solely responsible for your interactions with any other User in connection with the Services and neither GivingBack nor its Affiliates will have any liability or responsibility with respect thereto. GivingBack and its Affiliates reserve the right, but have no obligation, to become involved in any way with disputes between you and any other User of the Services.
`
              ]
            }
          ]
        },
        {
          title: `19. Changes to the Terms`,
          subContent: [
            {
              content: [
                `19.1. Policies regarding how changes to the Terms of Service will be communicated and implemented: We reserve the right, at our sole discretion, to change or modify portions of these Terms of Service at any time. Where possible we will provide 30 days’ notice of substantive changes to these Terms of Service and, if appropriate, we may inform Users of such changes via email or other appropriate means. Changes may be made at short or no notice where a change is required by law. When we make a change, we will post the revised Terms of Service on this page and will indicate the date of such revision. Your continued use of the Services after the date of any such changes constitutes your acceptance of the new Terms of Service. If you do not wish to accept the new Terms of Service, you should discontinue your use of the Services.
`,
                `19.2. English Version Binding: To the extent allowed by applicable law, the English language version of these Terms of Service is binding and their translations in other languages are for convenience only; in case of discrepancies between the English version of these Terms of Service and their translations, the English version shall prevail.
`
              ]
            }
          ]
        },
        {
          title: `20. Miscellaneous`,
          subContent: [
            {
              content: [
                `
          20.1. Entire Agreement: These Terms of Service constitute the entire agreement between you and GivingBack and govern your use of the Services and the Platform, superseding any prior agreements between you and GivingBack with respect to the Services. You also may be subject to additional terms of service that may apply when you use affiliate or third-party services, third-party content or third-party software.
          `,
                `20.2. Governing Law: For all Users, these Terms of Service will be governed by the laws of the Federal republic of Nigeria without regard to its conflict of law provisions. With respect to any disputes or claims not subject to arbitration, as set forth above, you and GivingBack agree to submit to the personal and exclusive jurisdiction of the state and federal courts located within Lagos State, Nigeria.
          `,
                `20.3. Waiver: The failure of GivingBack to exercise or enforce any right or provision of these Terms of Service will not constitute a waiver of such right or provision.
          `,
                `20.4. Severability: If any provision of these Terms of Service is found by a court of competent jurisdiction to be (or are otherwise) invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties’ intentions as reflected in the provision, and the other provisions of these Terms of Service remain in full force and effect.
          `,
                `20.5. Printed Version: A printed version of this agreement and of any notice given in electronic form will be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.
          `,
                `20.6. Assignment: You may not assign these Terms of Service without the prior written consent of GivingBack, but GivingBack and/or its Affiliates may assign or transfer these Terms of Service, in whole or in part, without restriction. For the sake of clarity, GivingBack and/or its Affiliates may, at any time, assign our rights or delegate our obligations hereunder without notice to you in connection with a merger, acquisition, reorganization or sale of equity or assets, or by operation of law or otherwise.
          `,
                `20.7. Section Titles: The section titles in these Terms of Service are for convenience only and have no legal or contractual effect.
          `,
                `20.8. Notices: To the extent permitted by applicable law, notices to you may be made via email or regular mail. The Services may also provide notices to you of changes to these Terms of Service or other matters by displaying notices or links to notices generally on the Platform.
          
          `,
                `20.9. Force Majeure: Except to the extent provided otherwise under applicable law, GivingBack shall not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, but not limited to, acts of God, war or threats of war, terrorism or threats of terrorism, riots, embargos, acts of civil or military authorities, fire, floods, accidents, governmental regulation or advisory, recognized health threats, as determined by the World Health Organization, the Centers for Disease Control, or local government authority or health agencies, strikes or shortages or curtailment of transportation facilities, fuel, energy, labor or materials.
          `
              ]
            }
          ]
        },
        {
          title: `21. Questions? Concerns? Suggestions?`,
          content: `Please contact us to report violations or pose any question.`
        }
      ]
    }
  ]

  return (
    <Layout>
      <PageBanner pageName='Terms of Service' />
      <section className='privacy-policy-section section-gap-extra-bottom'>
        <div className='container'>
          {privacyPolicyData.map((section, index) => (
            <div key={index}>
              {section.main && <h2>{section.main}</h2>}
              <br />

              {section.sub.map((subSection, subIndex) => (
                <div key={subIndex}>
                  {subSection.title && (
                    <>
                      <h3>{subSection.title}</h3>
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
                            {/* <h6>{subSubSection.title}</h6> */}
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

export default Terms
