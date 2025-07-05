import { ChevronRight } from "lucide-react";
import { Image } from "react-bootstrap";

const Sponsor = ({ handleMessage, logo, project }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title mb-3">Project sponsors</h6>

        {project?.sponsors?.map((sponsor, index) => (
          <div key={index} className="d-flex align-items-start mb-3">
            <Image
              src={sponsor.image || logo}
              alt={sponsor.name}
              width={50}
              height={50}
              className="bg-white rounded-circle m-2"
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{sponsor.name}</div>
              <div className="text-muted small mb-2">{sponsor.description}</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleMessage}
                className="text-success text-decoration-none small"
              >
                Send a message <ChevronRight size={12} className="ms-1" />
              </div>
            </div>
          </div>
        ))}

        <button className="btn btn-success rounded-lg py-3 w-100">
          Add New Sponsor
        </button>
      </div>
    </div>
  );
};

export default Sponsor;
