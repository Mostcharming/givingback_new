/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageBanner from "../../components/home/pageBanner";
import CommentCard from "../../components/projects/comment-card";
import SubmitCommentModal from "../../components/projects/SubmitCommentModal";
import Layout from "../../layouts/home";
import useBackendService from "../../services/backend_service";
import { useLoadStyles } from "../../services/styles";
import Util from "../../services/utils";

import avatar from "../../assets/images/home/avatar.svg";

const ProjectDetails = () => {
  useLoadStyles(["givingback"]);

  const [messages, setMessages] = useState<any[]>();
  const [isSubmitCommentModalOpen, setIsSubmitCommentModalOpen] =
    useState(false);
  const comment = useRef(null);

  const location = useLocation();
  const project: Partial<any> = location.state;

  const { mutate: getMessages } = useBackendService(
    `/community/${project?.id}`,
    "GET",
    {
      onSuccess: (res: any) => {
        setMessages(res.messages);
      },
      onError: () => {},
    }
  );

  const handleCloseSubmitCommentModal = () => {
    setIsSubmitCommentModalOpen(false);
    getMessages({});
  };
  const handleComment = () => {
    setIsSubmitCommentModalOpen(true);
  };

  return (
    <Layout>
      <PageBanner pageName="Project Details" />
      <section className="project-details-area section-gap-extra-bottom">
        <div className="container">
          <div style={{ paddingBottom: "30px" }}>
            <h1>{project?.title}</h1>
            <p>
              <span>
                Donor:{" "}
                {project.status === "unverified"
                  ? project.sponsors[0]?.name
                  : project.sponsors?.name}{" "}
              </span>{" "}
              | <span>Launch Date: {Util.formatDate(project?.createdAt)}.</span>
            </p>
          </div>
          {project.status === "unverified" && (
            <div className="alert alert-warning" role="alert">
              This project is currently under review and not yet verified.
            </div>
          )}
          <div className="row align-items-center justify-content-center">
            <div className="col-12">
              {project.status === "unverified" ? (
                project?.projectImages?.[0]?.image ? (
                  <img
                    src={project.projectImages[0].image}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                    alt="Project Image"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "10px",
                    }}
                  >
                    No image available
                  </div>
                )
              ) : project?.images?.[0]?.image ? (
                <img
                  src={project.images[0].image}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  alt="Project Image"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "10px",
                  }}
                >
                  No image available
                </div>
              )}
            </div>

            <div className="col-12">
              <div className="project-details-tab">
                <div className="tab-content" id="projectTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="description"
                    role="tabpanel"
                  >
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <div className="description-content">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "20px",
                            }}
                          >
                            <div>
                              <h4 className="description-title">
                                About {project?.title}
                              </h4>
                              <p>{project?.description}</p>
                            </div>
                            <div>
                              <h4 className="description-title">
                                Beneficiaries
                              </h4>
                              {project.status === "unverified" ? (
                                <p>{project?.beneficiaries[0]?.name}</p>
                              ) : (
                                <p>{project?.beneficiary_overview}</p>
                              )}
                              <br />
                              <h4 className="description-title">Community</h4>
                              {project.status === "unverified"
                                ? project?.beneficiaries.map(
                                    (beneficiary, index) => {
                                      return (
                                        <div key={index}>
                                          <p>{beneficiary.contact}</p>
                                          <p>{beneficiary.location}</p>
                                        </div>
                                      );
                                    }
                                  )
                                : project?.beneficiaries.map(
                                    (beneficiary, index) => {
                                      return (
                                        <div key={index}>
                                          <p>{beneficiary.contact}</p>
                                          <p>
                                            {beneficiary.city}{" "}
                                            {beneficiary.community}
                                          </p>
                                        </div>
                                      );
                                    }
                                  )}
                            </div>
                          </div>

                          {project.status === "unverified"
                            ? project?.projectImages
                                .slice(1)
                                .map((image, index) => (
                                  <img
                                    key={index}
                                    className="mt-4 mb-5"
                                    src={image.image}
                                    style={{
                                      width: "100%",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                  />
                                ))
                            : project?.projectImages
                                .slice(1)
                                .map((image, index) => (
                                  <img
                                    key={index}
                                    className="mt-4 mb-5"
                                    src={image.image}
                                    style={{
                                      width: "100%",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                  />
                                ))}

                          {project.status !== "unverified" && (
                            <div className="description-content mt-3">
                              <h4 className="description-title">Milestones</h4>
                              <ul style={{ listStyleType: "auto" }}>
                                {project?.milestones?.map(
                                  (milestone, index) => {
                                    return (
                                      <ol key={index}>
                                        <li
                                          style={{ marginLeft: "20px" }}
                                          key={index}
                                        >
                                          {milestone.milestone}
                                        </li>
                                      </ol>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-10">
                        <div className="rewards-box mt-md-50">
                          {/* <h4 className="title" style={{ color: "#239742" }}>
                            Project Status
                          </h4>
                          <hr
                            style={{
                              width: "100%",
                              backgroundColor: "#239742",
                              height: "6px",
                            }}
                          /> */}
                          {/* <CustomTable
                            rows={[]}
                            columns={[]}
                            rowHeight={() => "auto"}
                            cellClassName="py-2 milestone-table-cell custom-cell cursor-pointer"
                          /> */}
                          <h4>About the Donor</h4>
                          <p>
                            {project.status === "unverified"
                              ? project.sponsors[0]?.description
                              : project.sponsor?.about}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="comment__container">
                      <h4>Community Responses</h4>
                      <hr />
                      <div className="user-comment__area">
                        <img className="avatar_img" src={avatar} />
                        <div className="user-comment__container">
                          <div>
                            <div className="user-details">
                              <p style={{ fontWeight: "600" }}>User</p>
                              <p>{messages?.length} Comments</p>
                            </div>
                            <textarea
                              placeholder="Join the discussion..."
                              ref={comment}
                            />
                            <button
                              className="float-end mt-2 comment_button"
                              onClick={handleComment}
                            >
                              Comment
                            </button>
                          </div>
                          {/* {COMMENT_ARRAY.map((item) => {
                            return <CommentCard />;
                          })}

                          <button className="view__all--button">
                            View All Comments
                          </button> */}
                        </div>
                      </div>
                      <div className="comment-reply__container">
                        {messages?.map((messages) => {
                          return (
                            <CommentCard key={messages.id} message={messages} />
                          );
                        })}

                        <button
                          className="view__all--button w-[10vw]"
                          onClick={getMessages}
                        >
                          View All Comments
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="update" role="tabpanel">
                    Update
                  </div>
                  <div
                    className="tab-pane fade"
                    id="bascker-list"
                    role="tabpanel"
                  >
                    Bascker List
                  </div>
                  <div className="tab-pane fade" id="reviews" role="tabpanel">
                    Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SubmitCommentModal
        open={isSubmitCommentModalOpen}
        handleClose={handleCloseSubmitCommentModal}
        comment={comment.current?.value}
        projectId={project?.id}
      />
    </Layout>
  );
};

export default ProjectDetails;
