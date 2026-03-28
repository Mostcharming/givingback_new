import {
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Link as LinkIcon,
  MapPin,
} from "lucide-react";
import { Badge, Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import "./singleBrief.css";

export default function SingleBriefs() {
  return (
    <div className="brief-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-section">
        <Container>
          <Row>
            <Col>
              <div className="d-flex align-items-center gap-2 text-sm">
                <span className="">Briefs</span>
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
                <span className="">Community Health Initiative</span>
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
                src="https://api.builder.io/api/v1/image/assets/TEMP/f6f64a63c375d830364f82103fd5f57910b41881?width=100"
                alt="Community Health Initiative"
                className="banner-img"
              />
            </Col>
            <Col xs="12" sm="auto" className="flex-grow-1">
              <h1 className="banner-title">Community Health Initiative</h1>
              <p className="banner-subtitle">
                Sponsored by HealthPlus Foundation
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
                <p className="detail-value">$75,000 - $120,000</p>
              </div>
            </div>
          </Col>

          {/* Location */}
          <Col md="4" xs="12" className="detail-item mb-4 mb-md-0">
            <div className="d-flex gap-3">
              <MapPin className="detail-icon" />
              <div>
                <p className="detail-label">Location</p>
                <p className="detail-value">South west, Nigeria</p>
              </div>
            </div>
          </Col>

          {/* Deadline */}
          <Col md="4" xs="12" className="detail-item">
            <div className="d-flex gap-3">
              <Calendar className="detail-icon" />
              <div>
                <p className="detail-label">Deadline</p>
                <p className="detail-value">May 30, 2025</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tags */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-wrap gap-2">
              <Badge color="success" pill>
                Healthcare
              </Badge>
              <Badge color="success" outline pill>
                Rural health
              </Badge>
              <Badge color="success" outline pill>
                Preventive care
              </Badge>
              <Badge color="success" outline pill>
                Mobile services
              </Badge>
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
                      Apply before May 30, 2025 to be considered for this
                      opportunity
                    </p>
                  </Col>
                  <Col md="4" xs="12" className="text-md-end">
                    <Button
                      color="success"
                      size="lg"
                      block
                      className="rounded-lg"
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
              Funding for mobile health clinics in under-served rural areas to
              provide basic healthcare and preventive services. This initiative
              aims to address the growing healthcare disparities in rural
              communities where access to medical services is limited. The
              program will focus on preventive care, basic treatments, health
              education, and connecting patients to specialized services as
              needed.
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
                  Minimum of 3 years operating experience in respective field
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
              The selected organization(s) will be expected to reach at least
              2,000 individuals with direct services in the first year, with
              increasing outreach in subsequent years. Priority will be given to
              proposals that demonstrate potential for significant health
              outcome improvements and community engagement.
            </p>
          </Col>
        </Row>

        {/* Timeline */}
        <Row className="mb-4 section-spacing">
          <Col>
            <h2 className="section-title">Timeline</h2>
            <div className="timeline">
              {[
                {
                  date: "May 30, 2025",
                  event: "Application deadline",
                },
                {
                  date: "June 15, 2025",
                  event: "Finalist notifications",
                },
                {
                  date: "June 25-30, 2025",
                  event: "Finalist interviews",
                },
                {
                  date: "July 15, 2025",
                  event: "Candidate announcement",
                },
                {
                  date: "August 1, 2025",
                  event: "Funding disbursement",
                },
                {
                  date: "September 1, 2025",
                  event: "Project launch",
                },
              ].map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker" />
                  {index < 5 && <div className="timeline-line" />}
                  <div className="timeline-content">
                    <p className="timeline-date">{item.date}</p>
                    <p className="timeline-event">{item.event}</p>
                  </div>
                </div>
              ))}
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
                      src="https://api.builder.io/api/v1/image/assets/TEMP/c7abff9c932d5d0188d0a8e66686898bcbe29143?width=80"
                      alt="HealthPlus Foundation"
                      className="sponsor-logo"
                    />
                  </Col>
                  <Col>
                    <p className="sponsor-name">Community Health Initiative</p>
                    <p className="sponsor-description">
                      HealthPlus Foundation is committed to improving healthcare
                      access in underserved communities through strategic grants
                      and partnerships with effective organizations.
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
            <Button color="success" size="lg" block className="cta-button">
              Apply for this opportunity
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
