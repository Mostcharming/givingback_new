import { useState } from "react";
// import PageBanner from "../../components/home/pageBanner";
import Layout from "../../layouts/home";
import { useLoadStyles } from "../../services/styles";

import madamImage from "../../assets/images/home/new/madam.jpeg";
import mayImage from "../../assets/images/home/new/may.jpeg";
import mrpelumiImage from "../../assets/images/home/new/mrpelumi.png";
import mrsamImage from "../../assets/images/home/new/mrsam.png";
import pastorImage from "../../assets/images/home/new/pastor.png";
import pelumi from "../../assets/images/home/new/pelumi.jpeg";
import { toast } from "react-toastify";
import hands from "../../assets/images/home/main_image/hands.png";
import hands2 from "../../assets/images/home/new/about_hand.png";
import hands3 from "../../assets/images/home/new/hand3.png";
import smile1 from "../../assets/images/home/new/smile1.png";
import greenback from "../../assets/images/home/new/greenback.png";

const About = () => {
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
  useLoadStyles(["givingback"]);

  const teamMembers = [
    {
      name: "Olumide Ademidun",
      position: "Platform Lead",
      linkedinLink: "#",
      image: pastorImage,
      bio: `Olumide Ademidun is the Chief Platform Officer for GivingBack® Organization. 
      A graduate of Computer Science from the University of Lagos and holder of an MBA in Strategic Management, 
      Olumide is a Certified Member of the Project Management Institute, North America (PMP), and a long-standing Fellow of the British Computer Society. 
      He has been part of several innovative start-up businesses both within and outside Nigeria. 
      Olumide is an active and vibrant founding member of various Nigerian-Canadian Business and Professional Groups, 
      dedicated to promoting Foreign Direct Investment to Nigeria and ensuring Transparency, Integrity, and Values are given the highest consideration in businesses. 
      He is currently a Board Member of Milton Community Services Advisory Committee and Milton Community Fund Committee and has a vast business interest in Nigeria.`,
    },
    {
      name: "Vivian Byron",
      position: "Corporate & Legal Lead",
      linkedinLink: "#",
      image: madamImage,
      bio: `Attended the. Prestigious University of lfe as it then was .Now Obafemi Awolowo University (OAU).

Graduated with Llb hons in 1988 and conferred with Bachelor of Law in 1990
Amongst others she worked in the iconic law firm Irving and bonnar spanning   roughly a decade where she garnered. a wealth of.  experience practicing both corporate and advocate law in High proffle cases and. Corporate issues.
She became. a notary public in 2012

In 2021 she was conferred with the membership of the Nigerian institute of Chartered Arbitrator
Principal Partner Vivian Byron and co 
A successful law firm`,
    },
    {
      name: "Samuel Omotayo",
      position: "Product & Business Development",
      linkedinLink: "https://www.linkedin.com/in/omotayosamuel/",
      image: mrsamImage,
      bio: `Visionary product leader with 15+ years of experience delivering new-to-live and managing matured products in several industries such as banking, fintech, telecoms, and government in delivering impactful solutions and products. 
      Strong track record of bringing new products to life, including launching the first digital bank in West Africa, which now powers over 2MM+ financial transactions and 5MM API+ calls daily. 
      He recently managed and grew a product with over 65 million users covering 32 countries across the Caribbean islands, Latin America (LATAM), French West Indies and the Pacific region. 
      More so, his experience extends into the public sector, where he was responsible for the entire design of the GovTech platform, State Residents Identity Management System and Electronic Health Management System. 
      Similarly, he consulted for the Barbados Government in transforming ideas from the government-led hackathon to actual products. 
      He has supported many incubating start-ups and fintech on lean-agile product strategy as the Head of Innovation for Wema Bank after launching ALAT by Wema, Nigeria's first fully digital bank. 
      Before these roles, he worked with Etisalat, Yuuzoo (Singapore) and GTBank and consulted for West Africa's leading financial institutions - Zenith Bank, UBA and Access Bank in different capacities.`,
    },
    {
      name: "Akinpelumi Akinlolu",
      position: "Advocacy Lead",
      linkedinLink: "#",
      image: mrpelumiImage,
      bio: "Akinpelumi leads advocacy initiatives, engaging stakeholders for impact.",
    },
    {
      name: "Fadeni Mayowa",
      position: "Technology Lead",
      linkedinLink: "https://www.linkedin.com/in/mayowaffredrick/",
      image: mayImage,
      bio: `Fadeni Mayowa is an experienced Technology Lead and full-stack developer with a strong focus on leveraging technology to solve real-world challenges. 
        With a background in computer science and over 5 years of professional experience, he has been pivotal in building scalable software solutions for various industries, including agriculture, fintech, and nonprofit organizations. 
        At GivingBack, Mayowa oversees the design, implementation, and optimization of the organization's technological infrastructure. 
        Beyond his technical expertise, Mayowa is deeply passionate about creating innovative solutions that foster transparency, efficiency, and impact. 
        As the Technology Lead, he is responsible for driving the vision and strategy of GivingBack's technology roadmap, ensuring the platform remains at the forefront of innovation in the philanthropic sector.
        Outside of work, Mayowa actively mentors young developers and contributes to open-source projects, demonstrating his commitment to the growth of the tech ecosystem. 
        His leadership style emphasizes collaboration, continuous learning, and staying adaptable in an ever-evolving industry.`,
    },
    {
      name: "Akindele Oluwapelumi",
      position: "Designer",
      linkedinLink: "#",
      image: pelumi,
      bio: `Oluwapelumi is a creative designer who’s all about making digital experiences feel easy and engaging.
When she’s not deep in Figma or sketching out new concepts, you’ll probably find her binging a good series, vibing to music or getting lost in a great book. Oluwapelumi believes great design doesn’t just look good, it feels right. And that’s exactly what she brings to every project she works on.`,
    },
  ];

  const [selectedMember, setSelectedMember] = useState(null);

  const TeamMember = ({ name, position, linkedinLink, image, onClick }) => (
    <div className="col-xl-3 col-md-6 mb-4 pt-4" onClick={onClick}>
      <div className="card border-0 shadow position-relative">
        <img
          style={{
            paddingBottom: image === madamImage ? "58px" : "0",
          }}
          src={image}
          className="card-img-top"
          alt={name}
        />
        <div
          className="name-box position-absolute w-100"
          style={{
            bottom: "0",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px 0",
          }}
        >
          <a
            href={linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-overlay position-absolute"
            style={{
              top: "-20px",
              right: "10px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="27"
                cy="27"
                r="25.5"
                fill="#F4FFDF"
                stroke="#8CBE27"
                strokeWidth="3"
              />
              <g clipPath="url(#clip0_1798_9412)">
                <path
                  d="M20.5528 17.5714C20.5528 18.7552 19.6013 19.7143 18.427 19.7143C17.2528 19.7143 16.3013 18.7552 16.3013 17.5714C16.3013 16.3886 17.2528 15.4286 18.427 15.4286C19.6013 15.4286 20.5528 16.3886 20.5528 17.5714ZM20.5699 21.4286H16.2842V35.1429H20.5699V21.4286ZM27.4116 21.4286H23.1533V35.1429H27.4125V27.9437C27.4125 23.9409 32.5802 23.6134 32.5802 27.9437V35.1429H36.8556V26.4592C36.8556 19.7049 29.2082 19.9509 27.4116 23.2757V21.4286Z"
                  fill="#8CBE27"
                />
              </g>
              <defs>
                <clipPath id="clip0_1798_9412">
                  <rect
                    width="20.5714"
                    height="20.5714"
                    fill="white"
                    transform="translate(16.2842 14.5714)"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
          <h5 className="card-title mb-0 ml-2">{name}</h5>
          <div className="card-text text-black-50 ml-2">{position}</div>
        </div>
      </div>
    </div>
  );

  const features = [
    {
      title: "Transparency",
      description:
        "We believe in open, honest giving. Every donation, every project, and every impact is tracked and shared.",
      icon: (
        <svg
          width="22"
          height="19"
          viewBox="0 0 22 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12L6.45 9.1C6.61696 8.76866 6.87281 8.49029 7.18893 8.29603C7.50504 8.10176 7.86897 7.99927 8.24 8H19M19 8C19.3055 7.99946 19.6071 8.06894 19.8816 8.20308C20.1561 8.33723 20.3963 8.53249 20.5836 8.77387C20.7709 9.01525 20.9004 9.29633 20.9622 9.59555C21.024 9.89477 21.0164 10.2042 20.94 10.5L19.39 16.5C19.279 16.9299 19.0281 17.3106 18.6769 17.5822C18.3256 17.8538 17.894 18.0008 17.45 18H3C2.46957 18 1.96086 17.7893 1.58579 17.4142C1.21071 17.0391 1 16.5304 1 16V3C1 1.9 1.9 1 3 1H6.93C7.25941 1.0017 7.58331 1.08475 7.8729 1.24176C8.1625 1.39877 8.40882 1.62488 8.59 1.9L9.41 3.1C9.59118 3.37512 9.8375 3.60123 10.1271 3.75824C10.4167 3.91525 10.7406 3.9983 11.07 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Customer Centricity",
      description:
        "Whether you’re a donor, an NGO, or a beneficiary, your experience matters. We’re here to make giving seamless and rewarding.",
      icon: (
        <svg
          width="22"
          height="19"
          viewBox="0 0 22 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12L6.45 9.1C6.61696 8.76866 6.87281 8.49029 7.18893 8.29603C7.50504 8.10176 7.86897 7.99927 8.24 8H19M19 8C19.3055 7.99946 19.6071 8.06894 19.8816 8.20308C20.1561 8.33723 20.3963 8.53249 20.5836 8.77387C20.7709 9.01525 20.9004 9.29633 20.9622 9.59555C21.024 9.89477 21.0164 10.2042 20.94 10.5L19.39 16.5C19.279 16.9299 19.0281 17.3106 18.6769 17.5822C18.3256 17.8538 17.894 18.0008 17.45 18H3C2.46957 18 1.96086 17.7893 1.58579 17.4142C1.21071 17.0391 1 16.5304 1 16V3C1 1.9 1.9 1 3 1H6.93C7.25941 1.0017 7.58331 1.08475 7.8729 1.24176C8.1625 1.39877 8.40882 1.62488 8.59 1.9L9.41 3.1C9.59118 3.37512 9.8375 3.60123 10.1271 3.75824C10.4167 3.91525 10.7406 3.9983 11.07 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Innovation",
      description: `We harness technology to make philanthropy smarter, faster, and more effective—because generosity should never be limited by outdated systems.`,
      icon: (
        <svg
          width="22"
          height="19"
          viewBox="0 0 22 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12L6.45 9.1C6.61696 8.76866 6.87281 8.49029 7.18893 8.29603C7.50504 8.10176 7.86897 7.99927 8.24 8H19M19 8C19.3055 7.99946 19.6071 8.06894 19.8816 8.20308C20.1561 8.33723 20.3963 8.53249 20.5836 8.77387C20.7709 9.01525 20.9004 9.29633 20.9622 9.59555C21.024 9.89477 21.0164 10.2042 20.94 10.5L19.39 16.5C19.279 16.9299 19.0281 17.3106 18.6769 17.5822C18.3256 17.8538 17.894 18.0008 17.45 18H3C2.46957 18 1.96086 17.7893 1.58579 17.4142C1.21071 17.0391 1 16.5304 1 16V3C1 1.9 1.9 1 3 1H6.93C7.25941 1.0017 7.58331 1.08475 7.8729 1.24176C8.1625 1.39877 8.40882 1.62488 8.59 1.9L9.41 3.1C9.59118 3.37512 9.8375 3.60123 10.1271 3.75824C10.4167 3.91525 10.7406 3.9983 11.07 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Mutual Respect",
      description: `Collaboration thrives on trust. We foster a space where every stakeholder is valued, heard, and empowered to create lasting change.`,
      icon: (
        <svg
          width="22"
          height="19"
          viewBox="0 0 22 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12L6.45 9.1C6.61696 8.76866 6.87281 8.49029 7.18893 8.29603C7.50504 8.10176 7.86897 7.99927 8.24 8H19M19 8C19.3055 7.99946 19.6071 8.06894 19.8816 8.20308C20.1561 8.33723 20.3963 8.53249 20.5836 8.77387C20.7709 9.01525 20.9004 9.29633 20.9622 9.59555C21.024 9.89477 21.0164 10.2042 20.94 10.5L19.39 16.5C19.279 16.9299 19.0281 17.3106 18.6769 17.5822C18.3256 17.8538 17.894 18.0008 17.45 18H3C2.46957 18 1.96086 17.7893 1.58579 17.4142C1.21071 17.0391 1 16.5304 1 16V3C1 1.9 1.9 1 3 1H6.93C7.25941 1.0017 7.58331 1.08475 7.8729 1.24176C8.1625 1.39877 8.40882 1.62488 8.59 1.9L9.41 3.1C9.59118 3.37512 9.8375 3.60123 10.1271 3.75824C10.4167 3.91525 10.7406 3.9983 11.07 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <Layout>
      {/* <PageBanner pageName="About Us" /> */}
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
              About Our Organization
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
              Donors often struggle to assess impact due to unclear reports,
              affecting beneficiaries' support. At{" "}
              <span style={{ color: "#34A853" }}>GivingBack</span>, we solve
              this by leveraging technology to enable real-time collaboration
              among charity project stakeholders.
            </h6>
          </div>
        </div>
      </section>
      <div className="mt-3 about-form-area">
        <div className="container">
          <div className="about-donation-form">
            <img src={hands2} alt="" />
          </div>
        </div>
      </div>
      <section className="py-4 pl-4">
        <div className="container">
          <div className="row align-items-center g-4">
            <h3
              style={{
                fontSize: "20px",
                fontStyle: "italic",
                color: "#34A853",
                textDecoration: "underline",
              }}
            >
              Our Mission
            </h3>
          </div>
        </div>
      </section>
      <section className="py-1 pl-4">
        <div className="container">
          <div className="row align-items-center g-4">
            <h5>
              Due to unclear and non-insightful reports, donors struggle to
              articulate the effectiveness and impact (Stanford Social
              Innovation). At GivingBack, this means that beneficiaries may also
              not enjoy the full benefits intended for them. At GivingBack, we
              are set to address this problem by leveraging technology. We are a
              platform that enables real-time collaboration among charity
              project stakeholders.
            </h5>
          </div>
        </div>
      </section>
      <section className="py-4 pl-4">
        <div className="container">
          <div className="row align-items-center g-4">
            <h3
              style={{
                fontSize: "20px",
                fontStyle: "italic",
                color: "#34A853",
                textDecoration: "underline",
              }}
            >
              Our Vision
            </h3>
          </div>
        </div>
      </section>
      <section className="py-1 pl-4">
        <div className="container">
          <div className="row align-items-center g-4">
            <h5>
              Due to unclear and non-insightful reports, donors struggle to
              articulate the effectiveness and impact (Stanford Social
              Innovation). At GivingBack, this means that beneficiaries may also
              not enjoy the full benefits intended for them. At GivingBack, we
              are set to address this problem by leveraging technology. We are a
              platform that enables real-time collaboration among charity
              project stakeholders.
            </h5>
          </div>
        </div>
      </section>

      <section
        style={{ paddingBottom: "60px", paddingTop: "40px" }}
        className="feature-section feature-section-one section-gap"
      >
        <div className="container">
          <div className="row justify-content-lg-between justify-content-center align-items-center">
            <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
              <div className="">
                <img src={hands3} alt="Image" />
              </div>
            </div>
            <div className="col-lg-6 col-md-9">
              <div className="">
                <img src={smile1} alt="Image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#016741",
          backgroundImage: `url(${greenback})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "3rem 1rem",
        }}
        className="project-section "
      >
        <section className="py-1 pl-4">
          <div className="container">
            <div className="row align-items-center g-4">
              <h5
                style={{
                  color: "green",
                  backgroundColor: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  display: "inline-block",
                  border: "1px solid green",
                }}
              >
                Our Core Values
              </h5>
            </div>
          </div>
        </section>
        <section className="py-1 pl-4">
          <div className="container">
            <div className="row align-items-center g-4">
              <h3 className="p-3" style={{ color: "white" }}>
                What Drives Us
              </h3>
            </div>
          </div>
        </section>
        <div
          className="pl-4"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {features.map((feature, index) => (
            <div key={index}>
              <div className="col-xl-12 col-md-12 mb-4">
                <div
                  style={{
                    border: "1px solid rgb(7, 132, 86)",
                    borderRadius: "20px",
                    padding: "10px 0",
                  }}
                >
                  <div className="m-4">{feature.icon}</div>
                  <div className="name-box w-100">
                    <h5 className="m-4" style={{ color: "white" }}>
                      {feature.title}
                    </h5>
                    <h6
                      className="m-4"
                      style={{ color: "white", fontSize: "17px" }}
                    >
                      {feature.description}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section section-gap-extra-bottom">
        <div className="container">
          <div className="contact-from-area">
            <div className="container">
              <section className="mt-3 d-flex justify-content-center align-items-center">
                <div className="">
                  <div style={{ width: "60vw" }}>
                    <h2
                      className="title"
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "30px",
                        color: "black",
                      }}
                    >
                      Meet the amazing humans who make up GivingBack
                    </h2>
                  </div>
                </div>
              </section>
              <section className="mt-2 d-flex justify-content-center align-items-center">
                <div className="">
                  <div style={{ width: "70vw" }}>
                    <h6
                      className="title mt-2 "
                      style={{
                        textAlign: "center",
                        // fontWeight: '700',
                        fontSize: "18px",
                      }}
                    >
                      Our philosophy is simple, hire great people and give them
                      the resources and support to do their best work.
                    </h6>
                  </div>
                </div>
              </section>
              <div className="row">
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
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedMember(null)}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.49441 8.49427C-2.83147 19.8195 -2.83147 38.181 8.49441 49.5056C19.8196 60.8315 38.181 60.8315 49.5056 49.5056C60.8315 38.1803 60.8315 19.8189 49.5056 8.49362C38.1804 -2.83164 19.8196 -2.83099 8.49441 8.49427ZM47.3944 47.3943C37.2515 57.5372 20.7498 57.5372 10.6063 47.3943C0.464095 37.2515 0.464095 20.7497 10.6063 10.6062C20.7485 0.463935 37.2515 0.463935 47.3944 10.6062C57.5359 20.7484 57.5359 37.2515 47.3944 47.3943ZM20.5997 18.4877L18.4878 20.6002L26.8875 28.9999L18.4878 37.3996L20.5997 39.5121L29 31.1124L37.3996 39.5121L39.5128 37.3996L31.1125 28.9999L39.5122 20.5996L37.3996 18.4877L29 26.888L20.5997 18.4877Z"
                  fill="#239742"
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

export default About;
