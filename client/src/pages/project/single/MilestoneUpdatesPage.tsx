/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../components/home/loading";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";
import DonorMilestoneUpdates from "./render/DonorMilestoneUpdates";

const MilestoneUpdatesPage: React.FC<any> = () => {
  const [project, setProject] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { authState } = useContent();
  const navigate = useNavigate();
  const role = authState.user?.role;

  const { mutate: getTableData } = useBackendService("/allprojects", "GET", {
    onSuccess: (res: any) => {
      setProject(res.projects[0]);
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Error getting project data");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    getTableData({ projectType: "present", id: id });
  }, [id, getTableData]);

  const handleBack = () => {
    switch (role) {
      case "admin":
        navigate("/admin/projects");
        break;
      case "donor":
      case "corporate":
        navigate("/donor/projects");
        break;
      case "NGO":
        navigate("/ngo/projects");
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  if (isLoading) {
    return <Loading type={"inline"} />;
  }

  return <DonorMilestoneUpdates project={project} onBack={handleBack} />;
};

export default MilestoneUpdatesPage;
