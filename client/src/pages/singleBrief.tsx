/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Link as LinkIcon,
  MapPin,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge, Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import place from "../assets/images/home/GivingBackNG-logo.svg";
import Loading from "../components/home/loading";
import SubmitProposalModal from "../components/SubmitProposalModal";
import useBackendService from "../services/backend_service";
import { capitalizeFirstLetter } from "../services/capitalize";
import "./singleBrief.css";

const SingleBriefs: React.FC<any> = () => {
  const [brief, setBrief] = useState<any>({});
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { mutate: getBriefData, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setBrief(res.projects[0]);
      },
      onError: () => {
        toast.error("Error getting brief data");
      },
    }
  );

  useEffect(() => {
    getBriefData({ projectType: "present", id: id, status: "brief" });
  }, [id, getBriefData]);

  const handleBack = () => {
    navigate("/briefs");
  };

  if (isLoading) {
    return <Loading type={"inline"} />;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const milestones = brief.milestones || [];

  return (
    <div className="brief-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-section">
        <Container>
          <Row>
            <Col>
              <div className="d-flex align-items-center gap-2 text-sm">
                <span
                  className="text-decoration-none cursor-pointer"
                  onClick={handleBack}
                  style={{ cursor: "pointer" }}
                >
                  Briefs
                </span>
                <svg
                  className="breadcrumb-icon"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <path
                    d="M7.125 14.25L11.875 9.5L7.125 4.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="">
                  {capitalizeFirstLetter(brief.title) || "Brief"}
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Header Banner */}
      <div className="header-banner">
        <Container>
          <Row className="align-items-start">
            <Col xs="auto" className="mb-3 mb-sm-0">
              <img
                src={brief.projectImages?.[0]?.image || place}
                alt={brief.title || "Brief"}
                className="banner-img"
              />
            </Col>
            <Col xs="12" sm="auto" className="flex-grow-1">
              <h1 className="banner-title">
                {capitalizeFirstLetter(brief.title)}
              </h1>
              <p className="banner-subtitle">
                Sponsored by {brief.donor?.name || "Sponsor"}
              </p>
            </Col>
            <Col xs="auto" className="d-flex gap-2">
              <Button color="link" className="icon-button" title="Share">
                <LinkIcon className="icon-sm text-white" />
              </Button>
              <Button color="link" className="icon-button" title="Bookmark">
                <Bookmark className="icon-sm text-white" />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="main-content">
        {/* Details Row */}
        <Row className="details-row mb-4">
          {/* Budget */}
          <Col md="4" xs="12" className="detail-item mb-4 mb-md-0">
            <div className="d-flex gap-3">
              <Briefcase className="detail-icon" />
              <div>
                <p className="detail-label">Budget</p>
                <p className="detail-value">
                  NGN {brief.cost?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
          </Col>

          {/* Location */}
          <Col md="4" xs="12" className="detail-item mb-4 mb-md-0">
            <div className="d-flex gap-3">
              <MapPin className="detail-icon" />
              <div>
                <p className="detail-label">Location</p>
                <p className="detail-value">
                  {brief.state || "N/A"}, {brief.city || "N/A"}
                </p>
              </div>
            </div>
          </Col>

          {/* Deadline */}
          <Col md="4" xs="12" className="detail-item">
            <div className="d-flex gap-3">
              <Calendar className="detail-icon" />
              <div>
                <p className="detail-label">Deadline</p>
                <p className="detail-value">
                  {brief.endDate ? formatDate(brief.endDate) : "N/A"}
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tags */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-wrap gap-2">
              {brief.category && (
                <Badge
                  pill
                  style={{
                    backgroundColor: "#e2efe9",
                    color: "#128330",
                    // border: "1px solid #128330",
                    padding: "10px 16px",
                    fontSize: "14px",
                  }}
                >
                  {brief.category}
                </Badge>
              )}
              {brief.scope && (
                <Badge
                  pill
                  style={{
                    backgroundColor: "#e2efe9",
                    color: "#128330",
                    // border: "1px solid #128330",
                    padding: "10px 16px",
                    fontSize: "14px",
                  }}
                >
                  {brief.scope}
                </Badge>
              )}
            </div>
          </Col>
        </Row>

        {/* Call to Action Banner */}
        <Row className="mb-4">
          <Col>
            <Card className="cta-card">
              <CardBody>
                <Row className="align-items-center">
                  <Col md="8" xs="12" className="mb-3 mb-md-0">
                    <h2 className="cta-title">Ready to make an impact?</h2>
                    <p className="cta-subtitle">
                      Apply before{" "}
                      {brief.endDate
                        ? formatDate(brief.endDate)
                        : "the deadline"}{" "}
                      to be considered for this opportunity
                    </p>
                  </Col>
                  <Col md="4" xs="12" className="text-md-end">
                    <Button
                      color="success"
                      size="lg"
                      block
                      className="rounded-lg"
                      onClick={() => setIsProposalModalOpen(true)}
                    >
                      Apply now
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* About this project */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">About this project</h2>
            <p className="section-text">
              {capitalizeFirstLetter(brief.description) ||
                "No description available."}
            </p>
          </Col>
        </Row>

        {/* Requirements */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">Requirements</h2>
            <div className="requirements-list">
              <div className="requirement-item">
                <CheckCircle2 className="requirement-icon" />
                <p className="requirement-text">
                  Minimum of 3 years operating experience in healthcare services
                </p>
              </div>
              <div className="requirement-item">
                <CheckCircle2 className="requirement-icon" />
                <p className="requirement-text">
                  Licensed medical professionals on staff or as committed
                  partners
                </p>
              </div>
              <div className="requirement-item">
                <CheckCircle2 className="requirement-icon" />
                <p className="requirement-text">
                  Demonstrated ability to manage grants of similar size
                </p>
              </div>
              <div className="requirement-item">
                <CheckCircle2 className="requirement-icon" />
                <p className="requirement-text">
                  Experience working in rural or under-served communities
                </p>
              </div>
              <div className="requirement-item">
                <CheckCircle2 className="requirement-icon" />
                <p className="requirement-text">
                  Ability to commence work within 60 days of funding
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Eligibility */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">Eligibility</h2>
            <p className="section-text">
              This opportunity is open to registered non-profit organizations
              with 501(c)(3) status or equivalent. Public health departments,
              community health centers, and other healthcare-focused
              organizations are encouraged to apply. Collaborative proposals
              involving multiple organizations are welcome.
            </p>
          </Col>
        </Row>

        {/* Expected Impact */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">Expected Impact</h2>
            <p className="section-text">
              {brief.expectedImpact ||
                "No expected impact information specified."}
            </p>
          </Col>
        </Row>

        {/* Timeline */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">Timeline</h2>
            <div className="timeline">
              {milestones && milestones.length > 0 ? (
                milestones.map((milestone: any, index: number) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker" />
                    {index < milestones.length - 1 && (
                      <div className="timeline-line" />
                    )}
                    <div className="timeline-content">
                      <p className="timeline-date">
                        {milestone.due_date
                          ? formatDate(milestone.due_date)
                          : "TBD"}
                      </p>
                      <p className="timeline-event">
                        {capitalizeFirstLetter(milestone.milestone)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="section-text">
                  No timeline information available.
                </p>
              )}
            </div>
          </Col>
        </Row>

        {/* About the sponsor */}
        <Row className="mb-4 section-spacing">
          <Col>
            <Card className="sponsor-card">
              <CardBody>
                <h2 className="section-title">About the sponsor</h2>
                <Row className="mt-3">
                  <Col xs="auto">
                    <img
                      src={brief.donor?.image || place}
                      alt={brief.donor?.name || "Sponsor"}
                      className="sponsor-logo"
                    />
                  </Col>
                  <Col>
                    <p className="sponsor-name">
                      {brief.donor?.name || "Sponsor"}
                    </p>
                    <p className="sponsor-description">
                      {brief.donor?.bio ||
                        "Organization dedicated to making a positive impact."}
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Final CTA Button */}
        <Row>
          <Col>
            <Button
              color="success"
              size="lg"
              block
              className="cta-button"
              onClick={() => setIsProposalModalOpen(true)}
            >
              Apply for this opportunity
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Submit Proposal Modal */}
      <SubmitProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        briefTitle={brief.title}
      />
    </div>
  );
};

export default SingleBriefs;
