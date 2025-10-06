import { Info } from "lucide-react";
import { CardBody } from "reactstrap";

interface Activity {
  id: number;
  message: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    id: 1,
    message: "You donated $750 to Clean Water Initiative",
    timestamp: "Today, 12:36 PM",
  },
  {
    id: 2,
    message: "You donated $750 to Clean Water Initiative",
    timestamp: "Today, 12:36 PM",
  },
  {
    id: 3,
    message: "You donated $750 to Clean Water Initiative",
    timestamp: "Today, 12:36 PM",
  },
  {
    id: 4,
    message: "You donated $750 to Clean Water Initiative",
    timestamp: "Today, 12:36 PM",
  },
];

export default function Content({ data }) {
  console.log(data);
  return (
    <CardBody className="p-0">
      <div>
        {activities.map((activity, index) => (
          <div key={activity.id}>
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
                  {activity.message}
                </p>
                <p className="text-base text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>

            {index < activities.length - 1 && (
              <hr className="border-gray-200" />
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-1">
        {/* <a
          href="#"
          className="inline-flex items-center gap-2 text-lg font-medium text-green-600 no-underline hover:text-green-700"
        >
          View all activities
          <ArrowRight className="h-5 w-5" />
        </a> */}
      </div>
    </CardBody>
  );
}
