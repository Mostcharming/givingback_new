/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import main8 from "../../assets/images/home/main_image/1.png";
import p3 from "../../assets/images/home/main_image/3.png";
import p4 from "../../assets/images/home/main_image/4.png";
import v4 from "../../assets/images/home/main_image/Vector.png";
import v1 from "../../assets/images/home/main_image/Vector1.png";
import v2 from "../../assets/images/home/main_image/Vector2.png";
import v3 from "../../assets/images/home/main_image/Vector3.png";
import hands from "../../assets/images/home/main_image/hands.png";
import Rectangle from "../../assets/images/home/main_image/Rectangle.png";

import Layout from "../../layouts/home";
import useBackendService from "../../services/backend_service";
import { useLoadStyles } from "../../services/styles";
import { Image } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import FAQAccordion from "./faq/faq";
const Index = () => {
  useLoadStyles(["givingback"]);

  const [projects, setProjects] = useState<any[]>([]);

  const getAllProjects = useBackendService("/allprojects", "GET", {
    onSuccess: (res: any) => {
      setProjects(res.projects);
    },
    onError: () => {},
  }).mutate;

  useEffect(() => {
    getAllProjects({ page: 1, limit: 3, projectType: "present" });
  }, [getAllProjects]);

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
    <>
      <Layout transparentHeader topSecondaryBg>
        <br />
        <br /> <br /> <br />
        <br />
        <br />
        <section className="d-flex justify-content-center align-items-center">
          <div className="">
            <div style={{ width: "60vw" }}>
              <h2
                className="title"
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "40px",
                  color: "#34A853",
                }}
              >
                Make Every Donation Count, Support Life-Changing Projects And
                Make a Difference.
              </h2>
            </div>
          </div>
        </section>
        <section className="mt-2 d-flex justify-content-center align-items-center">
          <div className="">
            <div style={{ width: "50vw" }}>
              <h6
                className="title mt-2 mb-4"
                style={{
                  textAlign: "center",
                  // fontWeight: '700',
                  fontSize: "18px",
                }}
              >
                Join a global community that connects donors, NGO’s, &
                beneficiaries to create real impact. Fund meaningful projects,
                support verified NGO’s, & ensure donation reaches those who need
                it .
              </h6>
            </div>
          </div>
        </section>
        <section className="mt-3 d-flex justify-content-center align-items-center">
          <div className="">
            <div>
              <div>
                <a
                  href="/auth/register"
                  className="mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                  style={{ backgroundColor: "#F3FAF5", color: "#34A853" }}
                >
                  Create Project
                </a>
                <a
                  href="/latest-projects"
                  className="ml-4 mr-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                >
                  Explore Project
                  {/* <i className='far fa-arrow-right' /> */}
                </a>
                <a
                  href="/auth/register"
                  className="ml-4 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                  style={{ backgroundColor: "#F3FAF5", color: "#34A853" }}
                >
                  Join as an Organization
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-5 about-form-area">
          <div className="container">
            <div className="about-donation-form">
              <img src={Rectangle} alt="" />
            </div>
          </div>
        </div>
        <section
          style={{ paddingBottom: "60px" }}
          className="feature-section feature-section-one section-gap"
        >
          <div className="container">
            <div className="row justify-content-lg-between justify-content-center align-items-center">
              <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
                <div className="feature-content">
                  <div className="common-heading mb-3">
                    <h3
                      style={{
                        width: "max-content",
                        fontWeight: "600",
                        fontSize: "35px",
                      }}
                      className=""
                    >
                      About Us At GivingBack
                    </h3>
                  </div>
                  {/* Fancy Icon List */}
                  <div className="fancy-icon-list">
                    <div className="fancy-list-item">
                      <div className="contentT">
                        <p
                          style={{
                            fontWeight: "300",
                            color: "black",
                          }}
                        >
                          Due to unclear and non-insightful reports, donors
                          struggle to articulate the effectiveness and impact
                          (Stanford Social Innovation). This means that
                          beneficiaries may also not enjoy the full benefits
                          intended for them.
                        </p>
                      </div>
                    </div>
                    <div className="fancy-list-item">
                      <p
                        style={{
                          fontWeight: "300",
                          color: "black",
                        }}
                      >
                        At GivingBack, we are set to address this problem by
                        leveraging technology. We are a platform that enables
                        real-time collaboration among charity project
                        stakeholders.
                      </p>
                    </div>

                    <div className="fancy-list-item">
                      <p
                        style={{
                          fontWeight: "300",
                          color: "black",
                        }}
                      >
                        Our purpose is to optimize return on investment (ROI)
                        and impact on CSR/philanthropic investment.
                      </p>
                    </div>
                    <div className="fancy-list-item">
                      <div
                        style={{ width: "-webkit-fill-available" }}
                        className="row justify-content-lg-between justify-content-center align-items-center"
                      >
                        <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
                          <div className="feature-content">
                            {/* Fancy Icon List */}
                            <div className="fancy-icon-list">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                className="fancy-list-item"
                              >
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#34A853",
                                  }}
                                >
                                  5,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    color: "black",
                                  }}
                                >
                                  Projects Completed
                                </p>
                                <p
                                  style={{
                                    fontWeight: "300",
                                    color: "black",
                                  }}
                                >
                                  Reported by NGOs/NFPOs
                                </p>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                className="fancy-list-item"
                              >
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#34A853",
                                  }}
                                >
                                  120,000,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    color: "black",
                                  }}
                                >
                                  Beneficiaries Impacted
                                </p>
                                <p
                                  style={{
                                    fontWeight: "300",
                                    color: "black",
                                  }}
                                >
                                  From projects listed on this platform
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-9">
                          <div className="feature-content">
                            {/* Fancy Icon List */}
                            <div className="fancy-icon-list">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                className="fancy-list-item"
                              >
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#34A853",
                                  }}
                                >
                                  1,000+
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    color: "black",
                                  }}
                                >
                                  NGOs/NFPOs
                                </p>
                                <p
                                  style={{
                                    fontWeight: "300",
                                    color: "black",
                                  }}
                                >
                                  Across all geopolitical zones
                                </p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                className="fancy-list-item"
                              >
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#34A853",
                                  }}
                                >
                                  10+
                                </p>
                                <p
                                  style={{
                                    fontWeight: "500",
                                    color: "black",
                                  }}
                                >
                                  Industry Partners
                                </p>
                                <p
                                  style={{
                                    fontWeight: "300",
                                    color: "black",
                                  }}
                                >
                                  Multi-sectoral and global trusted partners
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fancy-list-item">
                      <a
                        href="/about_us"
                        style={{ width: "40vw" }}
                        className="mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-9">
                <div className="">
                  <img src={main8} alt="Image" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="d-flex justify-content-center align-items-center">
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
                The 4-Fold Problems We Are Solving
              </h2>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: "30px", paddingTop: "30px" }}
          className="feature-section feature-section-one "
        >
          <div className="container">
            <div className="row justify-content-lg-between justify-content-center align-items-center">
              <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
                <div
                  style={{ background: "#EDF7ED", borderRadius: "13px" }}
                  className="feature-content"
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: "25px" }} className="fancy-icon-list">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="fancy-list-item"
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          color: "black",
                        }}
                      >
                        Bringing Trust & Transparency to Giving
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: "black",
                        }}
                      >
                        Donors struggle with transparency, project verification,
                        & NGO credibility. We bridge the gap by ensuring
                        clarity, accountability, and trust in every donation.
                      </p>
                      <a
                        href="/auth/register"
                        style={{
                          fontWeight: "500",
                          color: "#218025",
                          textDecoration: "underline",
                        }}
                      >
                        Would you like to donate? Get started
                      </a>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      className="fancy-list-item"
                    >
                      <img className="p-3" src={v1} alt="Icon" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-9">
                <div
                  style={{ background: "#F5E9F7", borderRadius: "13px" }}
                  className="feature-content"
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: "25px" }} className="fancy-icon-list">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="fancy-list-item"
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          color: "black",
                        }}
                      >
                        Empowering Beneficiaries{" "}
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: "black",
                        }}
                      >
                        Beneficiaries often lack a voice in project execution,
                        making it hard to validate impact or fully enjoy
                        intended benefits. We ensure they’re included, heard,
                        and supported.{" "}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      className="fancy-list-item"
                    >
                      <img className="p-4" src={v2} alt="Icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: "25px" }}
          className="feature-section feature-section-one "
        >
          <div className="container">
            <div className="row justify-content-lg-between justify-content-center align-items-center">
              <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
                <div
                  style={{ background: "#FFF9E6", borderRadius: "13px" }}
                  className="feature-content"
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: "25px" }} className="fancy-icon-list">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="fancy-list-item"
                    >
                      {" "}
                      <p
                        style={{
                          fontWeight: "600",
                          color: "black",
                        }}
                      >
                        Simplifying NGO Engagement{" "}
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: "black",
                        }}
                      >
                        Connecting with beneficiaries is complex, and varied
                        feedback can feel overwhelming. We streamline the
                        process, helping NGOs gather insights and take
                        meaningful action.{" "}
                      </p>
                      <a
                        href="/auth/register"
                        style={{
                          fontWeight: "500",
                          color: "#916D00",
                          textDecoration: "underline",
                        }}
                      >
                        Are you an organization? Join now
                      </a>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      className="fancy-list-item"
                    >
                      <img className="p-3" src={v3} alt="Icon" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-9">
                <div
                  style={{ background: "#E8F4FE", borderRadius: "13px" }}
                  className="feature-content"
                >
                  {/* Fancy Icon List */}
                  <div style={{ padding: "25px" }} className="fancy-icon-list">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="fancy-list-item"
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          color: "black",
                        }}
                      >
                        Data-Driven Decision-Making
                      </p>
                      <p
                        style={{
                          // fontWeight: '500',
                          color: "black",
                        }}
                      >
                        Without a unified database, portfolio managers struggle
                        to track impact. We provide holistic visibility,
                        ensuring better analysis, insights, and informed
                        decisions.
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      className="fancy-list-item"
                    >
                      <img className="p-4" src={v4} alt="Icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-5 d-flex justify-content-center align-items-center">
          <div className="">
            <div style={{ width: "25vw" }}>
              <div className="fancy-list-item">
                <a
                  href="/about_us"
                  style={{ width: "25vw" }}
                  className="mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-5 d-flex justify-content-center align-items-center">
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
                Discover projects making a difference in communities around the
                world.
              </h2>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: "25px", paddingTop: "20px" }}
          className="feature-section feature-section-one"
        >
          <div className="container">
            <div className="row justify-content-center">
              {projects.slice(0, 3).map((project, index) => {
                const formatter = new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                });

                const cost = project.cost ?? project.allocated ?? 0;

                const totalMilestones = project.milestones?.length || 0;
                const completedMilestones =
                  project.milestones?.filter((m) =>
                    m.updates?.some((u) => u.status === "completed")
                  ).length || 0;

                const progressPercent = totalMilestones
                  ? Math.round((completedMilestones / totalMilestones) * 100)
                  : 0;

                return (
                  <div key={index} className="col-lg-4 col-md-6 mb-4">
                    <div
                      className="feature-content p-3"
                      style={{ borderRadius: "13px" }}
                    >
                      <img
                        src={
                          project?.projectImages?.length
                            ? project.projectImages[0].image
                            : "assets/images/project/project-1.jpg"
                        }
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "13px",
                        }}
                      />

                      <h5 className="mt-3 fw-bold">{project.title}</h5>

                      <div
                        className="progress mb-2"
                        style={{ height: "10px", borderRadius: "5px" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: "#34A853",
                            height: "100%",
                            borderRadius: "5px",
                            transition: "width 0.3s ease-in-out",
                          }}
                          aria-valuenow={progressPercent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <small>{progressPercent}% completed</small>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <strong>{formatter.format(cost)}</strong>
                        <a
                          href="/auth/register"
                          style={{ color: "#34A853", fontWeight: "600" }}
                        >
                          Donate Now
                          <span style={{ fontSize: "1rem", marginLeft: "2px" }}>
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="mb-5 d-flex justify-content-center align-items-center">
          <div className="">
            <div style={{ width: "25vw" }}>
              <div className="fancy-list-item">
                <a
                  href="/latest-projects"
                  style={{ width: "25vw" }}
                  className="mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                >
                  See More projects
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-5 d-flex justify-content-center align-items-center">
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
                Hear frome people whose lives have been changed through our
                platform
              </h2>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: "60px", paddingTop: "40px" }}
          className="feature-section feature-section-one"
        >
          <div
            style={{
              background: "#016741e0",
              backgroundImage: `url(${p4})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "3rem 1rem",
            }}
            className="container"
          >
            <div className="row justify-content-lg-between justify-content-center align-items-center">
              <div className="col-lg-6 col-md-9">
                <div className="">
                  <img src={p3} alt="Image" />
                </div>
              </div>
              <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12">
                <div className="feature-content">
                  {/* Fancy Icon List */}
                  <div className="fancy-icon-list">
                    <div className="fancy-list-item">
                      <div className="contentT">
                        <p
                          style={{
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          Meet Amina: A Story of Hope and Renewal
                        </p>
                      </div>
                    </div>
                    <div className="fancy-list-item">
                      <p
                        style={{
                          fontWeight: "300",
                          color: "white",
                        }}
                      >
                        For years, Amina, a widow and small-scale farmer,
                        struggled to provide for her children. Droughts and poor
                        harvests made it nearly impossible to make ends meet.
                        With little support, she feared for their future.
                      </p>
                    </div>

                    <div className="fancy-list-item">
                      <p
                        style={{
                          fontWeight: "300",
                          color: "white",
                        }}
                      >
                        Then, she discovered GivingBack. Through a crowdfunding
                        campaign, generous donors helped Amina buy better seeds,
                        farming tools, and irrigation equipment. Today, her farm
                        is thriving, her children are back in school, and she
                        even helps other widows in her community.{" "}
                      </p>
                    </div>

                    <div className="fancy-list-item">
                      <p
                        style={{
                          fontWeight: "300",
                          color: "white",
                          fontStyle: "italic",
                        }}
                      >
                        "I thought I was alone in my struggles but GivingBack
                        gave me hope. Now, I can dream again." – Amina
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="d-flex justify-content-center align-items-center">
          <div className="container">
            <div className="d-flex justify-content-center mb-4">
              <button
                className="btn btn-success rounded-circle me-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px", padding: "0" }}
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px", padding: "0" }}
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
        <section className="mt-5 d-flex justify-content-center align-items-center">
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
                Hear what our clients and partners are saying
              </h2>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {/* Testimonial 1 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-text text-secondary mb-4">
                      &quot;GivingBack has completely transformed how we
                      approach community support. With the help of donors from
                      this platform, we've been able to provide school supplies
                      for underprivileged children in Lagos. It's been a
                      game-changer.&quot;
                    </p>
                    <div className="d-flex align-items-center">
                      <div
                        className="ms-auto rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        JU
                      </div>
                      <div>
                        <p className="fw-medium mb-0">Adeola O. Akinyele</p>
                        <p className="small text-secondary mb-1">
                          NGO Coordinator
                        </p>
                        <div className="d-flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-text text-secondary mb-4">
                      &quot;Through this platform, we were able to gather the
                      funds to set up a clean water project in my village. The
                      impact has been life-changing, and because we received has
                      been overwhelming. We can't thank the donors enough.&quot;
                    </p>
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-light overflow-hidden me-3"
                        style={{ width: "48px", height: "48px" }}
                      >
                        <Image
                          src="/placeholder.svg?height=48&width=48"
                          alt="Ngozi I. Eze"
                          width={48}
                          height={48}
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <p className="fw-medium mb-0">Ngozi I. Eze</p>
                        <p className="small text-secondary mb-1">
                          Community Leader
                        </p>
                        <div className="d-flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-text text-secondary mb-4">
                      &quot;As a small business owner, I was struggling to find
                      resources to expand my operations. Through GivingBack, I
                      received mentorship that helped me scale my business and
                      employ more people in my community. I'm forever
                      grateful.&quot;
                    </p>
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-light overflow-hidden me-3"
                        style={{ width: "48px", height: "48px" }}
                      >
                        <Image
                          src="/placeholder.svg?height=48&width=48"
                          alt="Chinonso M. Olawale"
                          width={48}
                          height={48}
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <p className="fw-medium mb-0">Chinonso M. Olawale</p>
                        <p className="small text-secondary mb-1">
                          Entrepreneur
                        </p>
                        <div className="d-flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-4">
                <h3 className="mb-2">Common Questions</h3>
                <p className="text-secondary mb-3">
                  Find the answers to frequently asked questions here.
                </p>
                <div className="d-flex align-items-center text-success">
                  <span className="small">Need further support?</span>
                  <div
                    className="ms-2 border border-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "20px", height: "20px" }}
                  >
                    ?
                  </div>
                </div>
              </div>

              <FAQAccordion />
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
                  Join thousands of donors, NGOs, and communities already
                  creating lasting impact through meaningful collaboration.
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
    </>
  );
};

export default Index;
