import { Search } from "lucide-react";
import { Button } from "reactstrap";

const Briefs = () => {
  return (
    <div className="bg-custom-light min-vh-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="p-4">
              {/* Header */}
              <h3
                style={{ color: "#128330" }}
                className=" fs-4 fw-semibold mb-4"
              >
                Briefs
              </h3>

              {/* Empty State */}
              <div
                className="d-flex flex-column align-items-center justify-content-center text-center py-5"
                style={{ minHeight: "60vh" }}
              >
                {/* Search Icon */}
                <div className="mb-4">
                  <Search
                    className="text-icon-gray"
                    size={64}
                    strokeWidth={1.5}
                  />
                </div>

                <h4 className="text-custom-dark fs-4 fw-semibold mb-3">
                  No Funding Opportunities Available
                </h4>

                <div className="col-12 col-md-6 col-lg-8">
                  <p className="text-custom-muted mb-4 lh-base">
                    There are currently no active funding briefs from sponsors
                    or donors. New opportunities will appear here as they become
                    available.
                  </p>
                </div>

                <Button
                  className="btn mb-3 px-5 py-3 col-12 col-md-6 col-lg-8"
                  style={{ border: "none", background: "#02a95c" }}
                >
                  Check again later
                </Button>

                {/* Notification Text */}
                <div className="col-12 col-md-8 col-lg-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Briefs;
