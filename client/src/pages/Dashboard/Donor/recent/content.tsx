import { Info } from "lucide-react";
import { CardBody } from "reactstrap";

export default function Content({ data }) {
  const limitedData = data && data.length > 0 ? data.slice(0, 5) : [];

  return (
    <CardBody className="p-0">
      <div>
        {limitedData.length > 0 ? (
          limitedData.map((activity, index) => (
            <div key={activity.id || index}>
              <div
                style={{ display: "flex" }}
                className="flex items-center gap-4 px-6"
              >
                <Info
                  className="h-5 w-5"
                  style={{
                    color: "#16a34a",
                    marginTop: "10px",
                    marginRight: "20px",
                  }}
                  strokeWidth={2.5}
                />

                <div className="flex flex-col">
                  <p style={{ color: "black" }} className="text-xl font-normal">
                    {activity.type === "Wallet fund"
                      ? `You have Funded your wallet with ${activity.amount} NGN`
                      : `You donated ${activity.amount} NGN to ${
                          activity.project_name || "a project"
                        }`}
                  </p>
                  <p className="text-base text-gray-500 mt-1">
                    {activity.dateTime}
                  </p>
                </div>
              </div>

              {index < limitedData.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))
        ) : (
          <div className="px-6 py-4 text-center">
            <p>No recent activities found.</p>
          </div>
        )}
      </div>

      <div className="px-6 py-1"></div>
    </CardBody>
  );
}
