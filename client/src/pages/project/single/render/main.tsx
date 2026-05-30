import { Share2 } from "lucide-react";
import { Image } from "react-bootstrap";
import { capitalizeFirstLetter } from "../../../../services/capitalize";

const Main = ({ image, badgeProps, logo, project, currentState }) => {
  return (
    <>
      <div className="position-relative mb-5">
        <Image
          src={image}
          alt="Person drinking from water tap"
          width={600}
          height={300}
          className="card-img-top"
          style={{ height: "300px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 right-0 m-3">
          <span
            className="rounded-pill px-3 py-2"
            style={{
              backgroundColor: badgeProps.backgroundColor,
              color: badgeProps.color,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {badgeProps.text}
          </span>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Image
            src={logo}
            alt="Person drinking from water tap"
            width={50}
            height={50}
            className="bg-white rounded-circle m-2"
          />
          <div>
            <h2 className="h4 mb-1">{capitalizeFirstLetter(project.title)}</h2>
            <p className="text-muted mb-0">{currentState.user.name}</p>
          </div>
        </div>
        <button className="btn btn-success btn-sm">
          <Share2 size={16} />
        </button>
      </div>
    </>
  );
};
export default Main;
