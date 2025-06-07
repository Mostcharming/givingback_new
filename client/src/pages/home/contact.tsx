import React, { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../layouts/home";
import useBackendService from "../../services/backend_service";
import { useLoadStyles } from "../../services/styles";

const Contact = () => {
  useLoadStyles(["givingback"]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendContactForm = useBackendService("/send_email", "POST", {
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setIsSubmitting(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to send message. Please try again later.");
      setIsSubmitting(false);
    },
  }).mutate;

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phoneNumber, subject, message } = formData;
    if (!name || !email || !phoneNumber || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    sendContactForm(formData);
  };
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
      {/* <PageBanner pageName="Contact Us" /> */}

      <section
        style={{ paddingBottom: "60px", paddingTop: "20px" }}
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
                    Get in touch with us
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
                        Thanks for stopping by. Whether you have a question,
                        comment or just want to say hi to us, don’t be a
                        stranger. We are here to help and we love connecting
                        with our community.
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
                      Drop us a message or use the contact form to get in touch.
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
                                  color: "black",
                                  fontWeight: "600",
                                }}
                              >
                                Chat to us
                              </p>
                              <p
                                style={{
                                  // fontWeight: "500",
                                  color: "black",
                                }}
                              >
                                Our friendly team is here to help
                              </p>
                              <p
                                style={{
                                  fontWeight: "400",
                                  color: "#02a95c",
                                }}
                              >
                                info@givingbackng.org
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
                                  color: "black",
                                }}
                              >
                                Visit us
                              </p>
                              <p
                                style={{
                                  // fontWeight: "500",
                                  color: "black",
                                }}
                              >
                                Come say hello at our office
                              </p>
                              <p
                                style={{
                                  fontWeight: "300",
                                  color: "#02a95c",
                                }}
                              >
                                Muliner Towers, Alfred Rewane Rd. Ikoyi, Lagos{" "}
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
                                  color: "black",
                                }}
                              >
                                Call us
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  // color: "black",
                                }}
                              >
                                Our toll-free line
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  color: "#02a95c",
                                }}
                              >
                                +234 908 549 4236
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
                                  color: "#02a95c",
                                }}
                              >
                                Hours
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  color: "#02a95c",
                                }}
                              >
                                Monday - Saturday
                              </p>
                              <p
                                style={{
                                  fontWeight: "500",
                                  color: "#02a95c",
                                }}
                              >
                                9am - 5pm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-9">
              <div className="contact-form pt-5">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-field mb-25">
                        <input
                          type="text"
                          style={{
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#F2F2F2",
                            height: "55px",
                          }}
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-field mb-25">
                        <input
                          type="email"
                          id="email"
                          style={{
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#F2F2F2",
                            height: "55px",
                          }}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-field mb-25">
                        <input
                          type="text"
                          id="phoneNumber"
                          style={{
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#F2F2F2",
                            height: "55px",
                          }}
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-field mb-30">
                        <textarea
                          id="message"
                          style={{
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: "#F2F2F2",
                            // height: "55px",
                          }}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Enter Message"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="col-lg-12 form-field">
                        <button
                          style={{ width: "-webkit-fill-available" }}
                          className=" mt-3 mr-4 mb-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <>Send Message</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
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

export default Contact;
