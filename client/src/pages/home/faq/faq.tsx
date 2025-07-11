import { useState } from "react";
import "./global.css";

export default function Component() {
  const [activeTab, setActiveTab] = useState("Terms");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const tabs = ["Terms", "Registration", "Process"];

  const faqData = {
    Terms: [
      {
        question: "Who is a Donor?",
        answer:
          "Any Individual or Organization that donates to a proejct is considered a donor",
      },

      {
        question: "What is a Project?",
        answer:
          "Project is the initiative or service you are planning to provide in the form of giving back to a community. This varies from sponsoring a child's school education to a building infrastructure facilities for a community - any form of service or act of giving you intend to provide. GivingBack has some streamlined projects already defined that help to align your project with the United Nations Sustanable Development Goals. Aligning your project with some of those goals allows your projects to be a global contributor to the UNSDG and by so doing attract more visibilty and donors to you initiatives. This is essentially one of the greatest benefits and values of givingback platform, attracting global visibililty and funding to local community development projects.",
      },
      {
        question: "Who is a Partner",
        answer:
          "A registered Non-Govermental Organizations and Not-for-profit Organizations (NGOs/NPOs) on GivingBack validate the authenticity of the organization with various issuance authority. <br/> <br/> GivingBack do not nominate, recommend or show preference to any partner but autonomously verify partners on competency, project execution and perfromance on information provided. ,<br/> <br/> Our Community partners are spread across all the 6 geopolitical zones of the country. They represent local community and help implement community projects with maximum direct impact to the beneficiaries",
      },
      {
        question: "How do partners get to participate in a project",
        answer: `Partners do not need to know the sponsor or project operator tp get invited to participate otr get notification about any project. <br/> <br/>When a project of interest within partner domain of operation is created on the platform or when the sponsor specifically selected or shortlisted or invite partner to participate in the request for proposal, the partners automatically receives notification of interest through email notification with a direct link to the project brief <br/><br/> A partner can choose to participate in the project after reviewing the project brief by enagaging in the request for the proposal process or can also choose to ignore the brief if not interest. This is another value-added services GivingBack platform provides in promoting equall opportunity and accessibility to all based on performance and relevance of the partners and more importantly the overall impack to the beneficiary of the initiative. `,
      },
    ],
    Registration: [
      {
        question: "Why is registration required?",
        answer:
          "It allows us to verify our sponsor and partner on our platform. it is required to protect the integrity of our sponsor, partners and platform from fraud and any related financial crime. Lastly, it allows us to keep our platform users safe and protect thier identity from cybercrime",
      },
      {
        question: "what personal information do you keep on your platform",
        answer: `GivingBack does not keep any personal identification information on our platform or in our backend database. Required information are only used for real-time verification purposes and not stored.`,
      },
      {
        question: "How do I register?",
        answer: `You register by clicking on the login option on our website or <a href="/auth/register" style="color: blue; text-decoration: underline;">click here</a>.<br/><br/> Create an account with your personal email or use your existing Google profile (Gmail Users only).<br/><br/> Once you create an account a One time Password (OTP) will be sent to your email for verification.<br/><br/>Enter the verification code sent to your email.<br/><br/>Create a GivingBack profile by providing relevant information for our KYC process, Pleas kindly note that no personal identification information sucj as NIN, BVN, RC or Credit card is stored by GivingBack. This information is used for verification purposes only and is discarded once the verification is confirmed by the issuance authority.<br/><br/>Complete the registration process and you are set to start funding or create  your first project.`,
      },
      {
        question: "How do i create a project",
        answer: `To create a project there are two (2) conditions to be met - be a registered user with an existing account on GivingBack platform and have enough funds for your project.`,
      },
    ],
    Process: [
      {
        question:
          "Why do I need to fund my account before i can create a project brief?",
        answer: `A project brief is simply your project detail and profile. it allows you to talk to about the type of service or initiative you are trying to do, set your expectations, milestones, specific demographic or area you are targeting and the type of organization you are looking to work or collaborate with. Once this process is completed, all relevant or interested partners will have full visibility into the project and hence attract various interest groups that may be interested in collaborating or working with you. For that reason, you must have the required funds allocated for the project ready in your GivingBack wallet on the platform. This helps provide some level of confidence and assurance to our partner's organization (NGO) that all advertised GivingBack projects are geniune and funded, which enhances the quality and promptness of the responses we get from partners.`,
      },
      {
        question: "Who can be a beneficiary?",
        answer:
          "Anyone in need who meets our eligibility criteria and applies through a verified organization.",
      },
      {
        question: "How do I fund my account",
        answer: `Click on the 'fund my wallet' menu item in your profile and follow the steps on the screen to transfer funds into GivingBack wallet. Click on Create Project Brief to complete your project profile/brief and submit.`,
      },
      {
        question: "I have created and submitted my project brief, what next? ",
        answer: `When a project brief is created and submitted, all selected NGOs will be notified automatically by email, and interested NGOs will respond through the portal.<br/><br/> Please note that you are in full controll and responsible for the entire process - reviewing and selecting whoe meets your requirements and ultimately who decide to engage.<br/><br/>GivingBack does not participate nor receive any notification related to any of your processes on the platform user's activities`,
      },
    ],
  };

  const toggleItem = (item: string) => {
    setOpenItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        {/* Header */}
        <h1 className="faq-title">Frequently asked questions</h1>

        {/* Tab Navigation */}
        <div className="tab-container">
          <div className="tab-wrapper">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${
                  activeTab === tab ? "tab-active" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {faqData[activeTab as keyof typeof faqData].map((item, index) => (
            <div key={`${activeTab}-${index}`} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleItem(`${activeTab}-${index}`)}
              >
                <h3 className="question-text">{item.question}</h3>
                <svg
                  className={`chevron ${
                    openItems.includes(`${activeTab}-${index}`)
                      ? "chevron-open"
                      : ""
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              {openItems.includes(`${activeTab}-${index}`) && (
                <div className="faq-answer">
                  <div
                    className="answer-content"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                  {/* <div className="answer-content">{item.answer}</div> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
