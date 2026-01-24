import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Container } from "reactstrap";
import List from "../components/list";
import { FilterBar } from "../components/projects/FilterBar";
import { PageHeader } from "../components/projects/PageHeader";
import { ProjectsList } from "../components/projects/ProjectCard";
import { STYLES } from "../components/projects/ProjectsStyles";
import type {
  Area,
  Project,
  StatCardItem,
} from "../components/projects/ProjectsTypes";
import {
  getDefaultStatsItems,
  getStatsFromResponse,
} from "../components/projects/ProjectsUtils";
import { StatsSection } from "../components/projects/StatsSection";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DN_Projects = () => {
  const { authState } = useContent();
  const [cardItems, setCardItems] = useState<StatCardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [areas, setAreas] = useState<Area[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res) => {
      setAreas(res as Area[]);
    },
    onError: () => {},
  });

  const { mutate: getProjectStats } = useBackendService(
    "/auth/donor/project-stats",
    "GET",
    {
      onSuccess: (res: any) => {
        const items = getStatsFromResponse(res);
        setCardItems(items);
      },
      onError: () => {
        setCardItems(getDefaultStatsItems());
        toast.error("Error getting project statistics");
      },
    }
  );

  const { mutate: fetchDonorProjects } = useBackendService(
    "/auth/donor/projects",
    "GET",
    {
      onSuccess: (res: any) => {
        const projectsData = res.data || [];
        setProjects(projectsData);
      },
      onError: () => {
        toast.error("Failed to fetch donor projects.");
        setProjects([]);
      },
    }
  );

  useEffect(() => {
    getProjectStats({});
    getAreas({});
    fetchDonorProjects({});
  }, [getProjectStats, getAreas, fetchDonorProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project: any) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" ||
        project.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, categoryFilter]);

  // Check if user is a donor or corporate user
  const isDonorOrCorporate =
    authState.user?.role === "donor" || authState.user?.role === "corporate";

  return (
    <Container
      fluid
      className="project-briefs-container"
      style={STYLES.container as any}
    >
      {isDonorOrCorporate && <PageHeader />}

      <div style={STYLES.spacer} />

      {isDonorOrCorporate && <StatsSection items={cardItems} />}

      <div style={STYLES.spacer} />

      {isDonorOrCorporate && (
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          areas={areas}
          onCategoryChange={setCategoryFilter}
        />
      )}

      {isDonorOrCorporate && <ProjectsList projects={filteredProjects} />}

      {!isDonorOrCorporate && <List type={"new"} />}
    </Container>
  );
};

export default DN_Projects;
