import { useState } from "react";
import "./global.css";

export default function Component() {
  const [activeTab, setActiveTab] = useState("Terms");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const tabs = ["Terms", "Registration", "Process"];

  const faqData = {
    Terms: [
      {
        question: "Who is a donor?",
        answer:
          "Any Individual or Organization that donates to a proejct is considered a donor",
      },

      {
        question: "What is a project?",
        answer:
          "A project is an initiative created by organizations that require funding to impact lives.",
      },
    ],
    Registration: [
      {
        question: "Why is registration required?",
        answer:
          "It allows us to verify our sponsor and partner on our platform. it is required to protect the integrity of our sponsor, partners and platform from fraud and any related financial crime. Lastly, it allows us to keep our platform users safe and protect thier identity from cybercrime",
      },
      {
        question: "How do I register my organization?",
        answer:
          "Click on 'Register', select 'Organization', and fill out the required information.",
      },
      {
        question: "What documents do I need?",
        answer:
          "You will need your organization's registration certificate, tax ID, and profile documents.",
      },
      {
        question: "How long does verification take?",
        answer:
          "Verification typically takes 2–5 business days depending on the completeness of your application.",
      },
      {
        question: "How do I create a project?",
        answer:
          "Only verified organizations can create projects from their dashboard.",
      },
    ],
    Process: [
      {
        question: "How do I give or donate?",
        answer:
          "You can donate directly to any project on our website. There is a limi to the maximum donation you can donate towards a project (from our website) without registration",
      },
      {
        question: "Who can be a beneficiary?",
        answer:
          "Anyone in need who meets our eligibility criteria and applies through a verified organization.",
      },
      {
        question: "How do I apply for assistance?",
        answer:
          "Visit the 'Get Help' page and complete the application form. A verified organization will follow up.",
      },
      {
        question: "What are the eligibility criteria?",
        answer:
          "Criteria include need-based assessment, supporting documents, and approval by an NGO partner.",
      },
      {
        question: "How do I create a project?",
        answer:
          "Only verified organizations can create projects from their dashboard.",
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
                  <div className="answer-content">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
