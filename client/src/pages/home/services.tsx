import Layout from "../../layouts/home";
import { useLoadStyles } from "../../services/styles";

import { useState } from "react";
import { toast } from "react-toastify";
import hands from "../../assets/images/home/main_image/hands.png";
import one from "../../assets/images/home/new/1.png";
import two from "../../assets/images/home/new/2.png";
import three from "../../assets/images/home/new/3.png";
import four from "../../assets/images/home/new/4.png";
import five from "../../assets/images/home/new/5.png";
import six from "../../assets/images/home/new/6.png";

const features = [
  {
    icon: one,

    number: "01",
    title: "Seamless Collaboration for Greater Impact",
    description: `Bringing Donors, NGO’s, and Beneficiaries Together`,
    des2: `We believe that collaboration fuels impact. Our platform enables real-time communication between donors, NGOs, project stakeholders, and beneficiaries. With in-app messaging and integrated planning tools, every voice is heard, every concern is addressed, and every project milestone is tracked—all in one place.`,
  },
  {
    icon: two,

    number: "02",
    title: "Manage All Your CSR Projects from One Dashboard",
    description: `Simplified Portfolio Management for Donors & Corporations`,
    des2: `Handling multiple Corporate Social Responsibility (CSR) projects? No problem! GivingBack provides a centralized dashboard where you can oversee, track, and manage all your charitable initiatives with ease. Say goodbye to scattered reports and lost data—get full transparency and accountability at your fingertips.`,
  },
  {
    icon: three,

    number: "03",
    title: "Real-Time Reports & Analytics",
    description: `Data-Driven Insights for Better Decision-Making`,
    des2: `Want to know the real impact of your contributions? Our powerful analytics dashboard gives you real-time reports on project performance, return on investment (ROI), and social impact. Monitor project deliveries, verify milestones, and evaluate success—all in a few clicks.`,
  },
  {
    icon: four,

    number: "04",
    title: "Search & Connect with NGO’s & Nonprofits You Can Trust",
    description: `Bringing Donors, NGO’s, and Beneficiaries Together`,
    des2: `Looking for an NGO that aligns with your values? Our directory service helps you discover and connect with accredited NGO’s and nonprofit organizations (NFPOs) with ease. Browse detailed profiles, success stories, and funding needs—so you can support projects that truly make a difference.`,
  },
  {
    icon: five,

    number: "05",
    title: "Secure & Transparent Fund Management",
    description: `Funding, Disbursing, and Reporting—All in One Place`,
    des2: `GivingBack ensures that every donated dollar reaches the right hands. Our secure fund management system helps donors allocate funds, track transactions, and generate reports for full transparency. NGOs can efficiently receive, dispense, and report on fund usage, ensuring accountability at every step.`,
  },
  {
    icon: six,

    number: "06",
    title: "Custom Landing Pages for NGO’s",
    description: `Boost Visibility & Build Stronger Donor Relationships`,
    des2: `Every NGO deserves a strong online presence. With GivingBack, NGO’s get a dedicated landing page with a custom URL to showcase their projects, share updates, and engage directly with donors. More visibility = more support = greater impact.`,
  },
];

const Services = () => {
  useLoadStyles(["givingback"]);
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      toast.error("Please enter an email address.");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
    } else {
      toast.success("Subscribed successfully!");
    }
  };

  return (
    <Layout>
      <section className="mt-4 d-flex justify-content-center align-items-center">
        <div className="">
          <div style={{ width: "60vw" }}>
            <h2
              className="title"
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "35px",
                color: "black",
              }}
            >
              Why we stand out exceptionally among competitors
            </h2>
          </div>
        </div>
      </section>
      <section className="mt-2 d-flex justify-content-center align-items-center">
        <div className="">
          <div style={{ width: "70vw" }}>
            <h6
              className="title mt-2 mb-4"
              style={{
                textAlign: "center",
                // fontWeight: '700',
                fontSize: "18px",
              }}
            >
              At GivingBack, we make it easy for donors, NGO’s, and
              beneficiaries to connect, collaborate, and create lasting impact.
              Whether you're funding a project, executing one, or benefiting
              from it, our platform ensures transparency, efficiency, and
              meaningful engagement every step of the way.
            </h6>
          </div>
        </div>
      </section>
      <section className="mt-1 d-flex justify-content-center align-items-center">
        <div className="fancy-list-item">
          <a
            href="/auth/register"
            style={{ width: "40vw" }}
            className="mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
          >
            Get Started
          </a>
        </div>
      </section>

      <section
        style={{
          padding: "3rem 1rem",
        }}
        className="project-section "
      >
        <div className="pl-4">
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                {" "}
                <div>
                  <div
                    style={{
                      borderRadius: "20px",
                    }}
                  >
                    <img src={feature.icon} />
                  </div>
                  <div style={{ color: "#02a95c" }} className="m-3">
                    {feature.number}
                  </div>
                  <div className="name-box w-100">
                    <h5 className="m-3" style={{ fontWeight: "bold" }}>
                      {feature.title}
                    </h5>
                    <h6 className="m-3" style={{ fontSize: "17px" }}>
                      {feature.description}
                    </h6>
                    <h6 className="m-3" style={{ fontSize: "17px" }}>
                      {feature.des2}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        style={{ paddingBottom: "60px", paddingTop: "40px" }}
        className="feature-section feature-section-one"
      >
        <div
          style={{
            backgroundImage: `url(${hands})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "3rem 1rem",
          }}
          className="container rounded"
        >
          <div className="">
            <div className=" d-flex flex-column align-items-center justify-content-center text-white p-4">
              <h3 className="text-white text-center mb-3 fs-2">
                Ready To Make A Difference?
              </h3>
              <p
                className="text-center mb-4 mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Join thousands of donors, NGOs, and communities already creating
                lasting impact through meaningful collaboration.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <a
                  href="/auth/regsiter"
                  className="ml-4 mr-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                >
                  I want to donate to projects
                </a>
                <a
                  href="/auth/regsiter"
                  className="ml-4 mr-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                >
                  I want to create projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h3
                style={{ fontWeight: 600, fontSize: "30px" }}
                className="text-success"
              >
                Subscribe to our newsletter to get the latest information
                directly from us!
              </h3>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  style={{
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#F8F8F8",
                    height: "55px",
                  }}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="ml-4 mr-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
