import React, { useState } from "react";
import "./index.css";

const faqData = [
  {
    id: 1,
    question: "Who is a donor?",
    answer:
      "Any individual or organization that donates to a project is considered a donor.",
  },
  {
    id: 2,
    question: "Who is a partner?",
    answer:
      "Partners are organizations or individuals who collaborate with GivingBack to support projects and initiatives.",
  },
  {
    id: 3,
    question: "How do I give or donate?",
    answer:
      'You can donate by selecting a project and clicking the "Donate" button. You’ll be guided through the donation process.',
  },
  {
    id: 4,
    question: "What is a project?",
    answer:
      "A project is an initiative created by an individual or organization seeking support to address a specific need or cause.",
  },
  {
    id: 5,
    question: "How do I create a project?",
    answer:
      'To create a project, sign up or log in to your account, navigate to "Create Project," and follow the guided steps.',
  },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="col-md-8">
      <div className="accordion" id="faqAccordion">
        {faqData.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div key={item.id} className=" mb-3">
              <h2 className="accordion-header">
                <button
                  type="button"
                  style={{ padding: "25px" }}
                  className={`accordion-button d-flex justify-between align-items-center ${
                    isActive ? "active" : "collapsed"
                  }`}
                  onClick={() => toggleItem(index)}
                >
                  <div
                    style={{
                      width: "100vw",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.question}</span>
                    <span style={{ fontSize: "20px" }} className="ms-auto">
                      {isActive ? "−" : "+"}
                    </span>
                  </div>
                </button>
                {isActive && (
                  <div
                    style={{ fontSize: "18px" }}
                    // className="accordion-body bg-white"
                    className={`accordion-button d-flex justify-between align-items-center ${
                      isActive ? "active" : "collapsed"
                    }`}
                  >
                    {item.answer}
                  </div>
                )}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
