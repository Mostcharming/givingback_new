import { useState } from "react";
import "./global.css";

export default function Component() {
  const [activeTab, setActiveTab] = useState("Donors");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const tabs = ["Donors", "Organizations", "Beneficiaries"];

  const faqData = {
    Donors: [
      "Who is a donor?",
      "How do I give or donate?",
      "How can I register my organization as a donor?",
      "What is a project?",
      "How do I create a project?",
    ],
    Organizations: [
      "How do I register my organization?",
      "What documents do I need?",
      "How long does verification take?",
    ],
    Beneficiaries: [
      "Who can be a beneficiary?",
      "How do I apply for assistance?",
      "What are the eligibility criteria?",
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
          {faqData[activeTab as keyof typeof faqData].map((question, index) => (
            <div key={`${activeTab}-${index}`} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleItem(`${activeTab}-${index}`)}
              >
                <h3 className="question-text">{question}</h3>
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
                  <div className="answer-content">
                    This is the answer content for "{question}". You can add
                    detailed information here to help users understand the topic
                    better.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
