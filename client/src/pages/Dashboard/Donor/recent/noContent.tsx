import { Info } from "lucide-react";
import { CardBody } from "reactstrap";

export default function NoContent() {
  return (
    <CardBody className="text-center py-5">
      <div className="mb-3">
        <Info
          size={24}
          className="text-muted mx-auto"
          style={{
            backgroundColor: "#e9ecef",
            borderRadius: "50%",
            padding: "8px",
            width: "40px",
            height: "40px",
          }}
        />
      </div>
      <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
        You have no activities so far. Once you start to make activities it
        would appear here
      </p>
    </CardBody>
  );
}
