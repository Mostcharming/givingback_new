import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import place from "../../assets/images/home//GivingBackNG-logo.svg";
import p3 from "../../assets/images/home/main_image/3.png";
import p4 from "../../assets/images/home/main_image/4.png";
import Loading from "../../components/home/loading";
import Layout from "../../layouts/home";
import useBackendService from "../../services/backend_service";
import { useLoadStyles } from "../../services/styles";

const LatestProject = () => {
  useLoadStyles(["givingback"]);

  const [projects, setProjects] = useState<any[]>([]);

  const { mutate: getAllProjects, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setProjects(res.projects);
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    }
  );

  useEffect(() => {
    const fetchProjects = async (status: string) => {
      if (status === "all") {
        getAllProjects({ page: 1, limit: 6 });
      } else {
        getAllProjects({
          page: 1,
          limit: 6,
          projectType: status,
        });
      }
    };

    fetchProjects("present");
  }, []);

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
      {/* <PageBanner pageName='Projects' /> */}

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
              Discover projects to donate to
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
              Browse different projects to get you to the causes that matter
              most to you and discover how to find good charities that support
              them.
            </h6>
          </div>
        </div>
      </section>

      <section
        style={{ paddingBottom: "60px", paddingTop: "40px" }}
        className="feature-section feature-section-one"
      >
        <div
          style={{
            background: "#02a95cdb",
            backgroundImage: `url(${p4})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "3rem 1rem",
          }}
          className="container"
        >
          <div
            style={{
              borderRadius: "20px",
              padding: "10px 0",
            }}
          >
            <div className="m-4">
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="25" cy="25" r="25" fill="white" />
                <path
                  d="M19 27L20.45 24.1C20.617 23.7687 20.8728 23.4903 21.1889 23.296C21.505 23.1018 21.869 22.9993 22.24 23H33M33 23C33.3055 22.9995 33.6071 23.0689 33.8816 23.2031C34.1561 23.3372 34.3963 23.5325 34.5836 23.7739C34.7709 24.0152 34.9004 24.2963 34.9622 24.5956C35.024 24.8948 35.0164 25.2042 34.94 25.5L33.39 31.5C33.279 31.9299 33.0281 32.3106 32.6769 32.5822C32.3256 32.8538 31.894 33.0008 31.45 33H17C16.4696 33 15.9609 32.7893 15.5858 32.4142C15.2107 32.0391 15 31.5304 15 31V18C15 16.9 15.9 16 17 16H20.93C21.2594 16.0017 21.5833 16.0848 21.8729 16.2418C22.1625 16.3988 22.4088 16.6249 22.59 16.9L23.41 18.1C23.5912 18.3751 23.8375 18.6012 24.1271 18.7582C24.4167 18.9152 24.7406 18.9983 25.07 19H31C31.5304 19 32.0391 19.2107 32.4142 19.5858C32.7893 19.9609 33 20.4696 33 21V23Z"
                  stroke="#02a95c"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M27 29C27.5523 29 28 28.5523 28 28C28 27.4477 27.5523 27 27 27C26.4477 27 26 27.4477 26 28C26 28.5523 26.4477 29 27 29Z"
                  stroke="#02a95c"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="name-box w-100">
              <h5 className="m-4" style={{ color: "white" }}>
                Find projects that matters to you
              </h5>
              <h6 className="m-4" style={{ color: "white", fontSize: "17px" }}>
                Send help where it’s needed most at the moment, with vetted
                charities helping in times of crisis, or organizations dedicated
                to a cause currently in the spotlight.
              </h6>
              <h6 className="m-4" style={{ color: "white", fontSize: "17px" }}>
                Learn more &#x27A1;
              </h6>
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

      <section
        style={{ paddingBottom: "25px", paddingTop: "20px" }}
        className="feature-section feature-section-one"
      >
        <div className="container">
          {isLoading ? (
            <Loading type={"inline"} />
          ) : (
            <div className="row justify-content-center">
              {projects.slice(0, 6).map((project, index) => {
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
                            : place
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
                            backgroundColor: "#02a95c",
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
                          style={{ color: "#02a95c", fontWeight: "600" }}
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
          )}
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

      <section className=" d-flex justify-content-center align-items-center">
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
              Hear from people whose lives have been changed through our
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
                      harvests made it nearly impossible to make ends meet. With
                      little support, she feared for their future.
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
                      is thriving, her children are back in school, and she even
                      helps other widows in her community.{" "}
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
                      "I thought I was alone in my struggles but GivingBack gave
                      me hope. Now, I can dream again." – Amina
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

export default LatestProject;
