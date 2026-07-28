import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useBackendService from "../services/backend_service";
import Loading from "./home/loading";

import cancel from "../assets/images/cancel.svg";
import Detail from "./detail";
import { ProjectItem } from "./ProjectItemCard";
// import Detail from '../../../../dashboard/past-projects/detail'

const NGOPastProjectsDetail = ({ id }: { id: number }) => {
  const [responseData, setResponseData] = useState([]);
  const [isViewProjectDetails, setIsViewProjectDetails] = useState(false);
  const [projectID, setProjectID] = useState<number>();

  const { mutate: getTableData, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setResponseData(res.projects);
      },
      onError: () => {
        toast.error("Error getting projects data");
      },
    }
  );

  useEffect(() => {
    getTableData({ projectType: "previous", organization_id: id });
  }, []);

  // const onViewProjectDetails = (id: number) => {
  //   setIsViewProjectDetails(true);
  //   setProjectID(id);
  // };

  return (
    <div className="mb-5">
      {isLoading && <Loading type={"inline"} />}
      {responseData.length == 0 && !isLoading && (
        <>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "calc(100vh - 360px)" }}
          >
            <div className="text-center">
              <h6 className="mb-3" style={{ fontSize: "16px" }}>
                No previous projects currently
              </h6>
              <img
                src={cancel}
                alt="cancel icon"
                width="30px"
                height="30px"
                className="mb-3"
              />
              <br />
            </div>
          </div>
        </>
      )}
      {responseData.length > 0 && !isLoading && !isViewProjectDetails && (
        <>
          <div>
            <Container>
              <Row className="pt-5">
                {responseData.map((project) => {
                  let img;
                  img = project.projectImages[0]?.image;
                  return (
                    <ProjectItem
                      project={project}
                      image={img}
                      key={project.id}
                      type={"past"}
                      // onViewProject={() => onViewProjectDetails(project.id)}
                    />
                  );
                })}
              </Row>
            </Container>
          </div>
        </>
      )}
      {isViewProjectDetails && <Detail projectID={projectID} isAdmin={true} />}
    </div>
  );
};

export default NGOPastProjectsDetail;
