import {
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileCheck2,
  MapPin,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "./dashboard.css";

type ReportView = "general" | "personal";

type Metric = {
  title: string;
  value: string;
  caption: string;
  change: string;
  period: string;
  accent: string;
  icon: typeof Building2;
};

type ProjectSeries = {
  name: string;
  values: number[];
  beneficiaries: string;
  duration: string;
};

type ImpactMarker = {
  id: number;
  name: string;
  type: "beneficiary" | "organization";
  latitude: number;
  longitude: number;
};

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2FmYWsiLCJhIjoiY2tubmFvdHVwMTM0bDJ2bnh3b3g5amdsYiJ9.fhCd-5dCeop0Jjn3cBV9VA";

// Temporary sample data. These objects can be replaced with API responses later.
const reportMetrics: Record<ReportView, Metric[]> = {
  general: [
    {
      title: "Total NGOs",
      value: "145",
      caption: "Active organizations",
      change: "+12%",
      period: "Since last month",
      accent: "#128330",
      icon: UsersRound,
    },
    {
      title: "Projects Completed",
      value: "328",
      caption: "Across all categories",
      change: "+8%",
      period: "Since last quarter",
      accent: "#ad22d0",
      icon: Trophy,
    },
    {
      title: "Active Projects",
      value: "62",
      caption: "Currently in progress",
      change: "+5%",
      period: "Since last month",
      accent: "#f97316",
      icon: FileCheck2,
    },
    {
      title: "Beneficiaries",
      value: "1.2M",
      caption: "People impacted",
      change: "+15%",
      period: "Annual growth",
      accent: "#1677ff",
      icon: UserRoundCheck,
    },
  ],
  personal: [
    {
      title: "NGOs Supported",
      value: "18",
      caption: "Organizations funded",
      change: "+4%",
      period: "Since last month",
      accent: "#128330",
      icon: UsersRound,
    },
    {
      title: "Projects Completed",
      value: "31",
      caption: "Through your support",
      change: "+6%",
      period: "Since last quarter",
      accent: "#ad22d0",
      icon: Trophy,
    },
    {
      title: "Active Projects",
      value: "9",
      caption: "Currently in progress",
      change: "+3%",
      period: "Since last month",
      accent: "#f97316",
      icon: FileCheck2,
    },
    {
      title: "People Reached",
      value: "48.6K",
      caption: "Estimated beneficiaries",
      change: "+11%",
      period: "Annual growth",
      accent: "#1677ff",
      icon: UserRoundCheck,
    },
  ],
};

const projectSeries: ProjectSeries[] = [
  {
    name: "Gender-Based Violence",
    values: [140, 380, 840, 1320, 1670, 2250, 2430, 2390],
    beneficiaries: "2,500",
    duration: "7 pm",
  },
  {
    name: "Primary Education",
    values: [220, 520, 730, 1080, 1490, 1820, 2140, 2680],
    beneficiaries: "2,680",
    duration: "9 pm",
  },
  {
    name: "Maternal Health",
    values: [110, 290, 650, 980, 1430, 1750, 2060, 2320],
    beneficiaries: "2,320",
    duration: "9 pm",
  },
];

const topOrganizations = [
  { name: "Women First Initiative", location: "Lagos", projects: 28 },
  { name: "Hope for Communities", location: "Abuja", projects: 24 },
  { name: "CareBridge Nigeria", location: "Kano", projects: 21 },
  { name: "Bright Future Network", location: "Enugu", projects: 19 },
];

const impactMarkers: ImpactMarker[] = [
  { id: 1, name: "Kebbi", type: "beneficiary", latitude: 11.4942, longitude: 4.2333 },
  { id: 2, name: "Katsina", type: "organization", latitude: 12.9908, longitude: 7.6018 },
  { id: 3, name: "Kano", type: "beneficiary", latitude: 12.0022, longitude: 8.592 },
  { id: 4, name: "Bauchi", type: "beneficiary", latitude: 10.3158, longitude: 9.8442 },
  { id: 5, name: "Borno", type: "beneficiary", latitude: 11.8469, longitude: 13.1571 },
  { id: 6, name: "Kaduna", type: "organization", latitude: 10.5105, longitude: 7.4165 },
  { id: 7, name: "Niger", type: "beneficiary", latitude: 9.9309, longitude: 5.5983 },
  { id: 8, name: "Abuja", type: "beneficiary", latitude: 9.0765, longitude: 7.3986 },
  { id: 9, name: "Nasarawa", type: "organization", latitude: 8.538, longitude: 8.303 },
  { id: 10, name: "Adamawa", type: "organization", latitude: 9.3265, longitude: 12.3984 },
  { id: 11, name: "Kwara", type: "organization", latitude: 8.9669, longitude: 4.3874 },
  { id: 12, name: "Oyo", type: "organization", latitude: 7.85, longitude: 3.933 },
  { id: 13, name: "Osun", type: "beneficiary", latitude: 7.5629, longitude: 4.52 },
  { id: 14, name: "Ondo", type: "organization", latitude: 7.2526, longitude: 5.1931 },
  { id: 15, name: "Enugu", type: "organization", latitude: 6.4584, longitude: 7.5464 },
  { id: 16, name: "Delta", type: "beneficiary", latitude: 5.704, longitude: 5.9339 },
  { id: 17, name: "Cross River", type: "beneficiary", latitude: 5.8702, longitude: 8.5988 },
];

const locations = {
  all: { label: "All locations", latitude: 8.55, longitude: 8.1, zoom: 5.3 },
  north: { label: "Northern Nigeria", latitude: 11.1, longitude: 8.3, zoom: 5.4 },
  south: { label: "Southern Nigeria", latitude: 6.3, longitude: 7.2, zoom: 5.7 },
};

const timeLabels = ["12 am", "3 am", "6 am", "9 am", "12 pm", "3 pm", "6 pm", "9 pm"];

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <article className="report-metric-card">
      <div className="report-metric-heading">
        <span>{metric.title}</span>
        <Icon aria-hidden="true" color={metric.accent} size={22} strokeWidth={1.8} />
      </div>
      <strong className="report-metric-value">{metric.value}</strong>
      <span className="report-metric-caption">{metric.caption}</span>
      <div className="report-metric-trend">
        <span>{metric.change}</span>
        <small>{metric.period}</small>
      </div>
    </article>
  );
}

function ImpactChart({ project }: { project: ProjectSeries }) {
  const maximum = Math.max(...project.values);

  return (
    <div className="report-chart-shell">
      <div className="report-chart-y-labels" aria-hidden="true">
        <span>5,000</span>
        <span>2,000</span>
        <span>1,000</span>
        <span>500</span>
        <span>100</span>
      </div>
      <div className="report-chart-grid">
        <div className="report-chart-tooltip">
          <span>Beneficiaries: <strong>{project.beneficiaries}</strong></span>
          <span>Time: <strong>{project.duration}</strong></span>
        </div>
        {project.values.map((value, index) => (
          <div className="report-chart-column" key={`${project.name}-${timeLabels[index]}`}>
            <div
              aria-label={`${value.toLocaleString()} beneficiaries at ${timeLabels[index]}`}
              className="report-chart-bar"
              style={{ height: `${Math.max(7, (value / maximum) * 78)}%` }}
              tabIndex={0}
            >
              <span>{value.toLocaleString()}</span>
            </div>
            <small>{timeLabels[index]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactMap({ selectedLocation }: { selectedLocation: keyof typeof locations }) {
  const location = locations[selectedLocation];
  const visibleMarkers = useMemo(() => {
    if (selectedLocation === "north") return impactMarkers.filter((marker) => marker.latitude >= 9);
    if (selectedLocation === "south") return impactMarkers.filter((marker) => marker.latitude < 9);
    return impactMarkers;
  }, [selectedLocation]);

  return (
    <div className="report-map" aria-label="Map of project impact across Nigeria">
      <Map
        key={selectedLocation}
        initialViewState={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: location.zoom,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        dragRotate={false}
        scrollZoom={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {visibleMarkers.map((marker) => (
          <Marker
            anchor="center"
            key={marker.id}
            latitude={marker.latitude}
            longitude={marker.longitude}
          >
            <button
              aria-label={`${marker.name}: ${marker.type}`}
              className={`report-map-marker report-map-marker--${marker.type}`}
              title={`${marker.name} — ${marker.type}`}
              type="button"
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}

function AdminDashboard({ donor = null }: { donor?: number | null }) {
  const [activeView, setActiveView] = useState<ReportView>("general");
  const [selectedProject, setSelectedProject] = useState(projectSeries[0].name);
  const [selectedLocation, setSelectedLocation] = useState<keyof typeof locations>("all");

  const activeProject =
    projectSeries.find((project) => project.name === selectedProject) ?? projectSeries[0];

  return (
    <main
      className="report-dashboard"
      data-report-audience={donor ? "donor" : "admin"}
    >
      <header className="report-header">
        <div>
          <div className="report-title-row">
            <h1>Reports</h1>
            <div className="report-tabs" aria-label="Report view">
              <button
                aria-pressed={activeView === "general"}
                className={activeView === "general" ? "active" : ""}
                onClick={() => setActiveView("general")}
                type="button"
              >
                General
              </button>
              <button
                aria-pressed={activeView === "personal"}
                className={activeView === "personal" ? "active" : ""}
                onClick={() => setActiveView("personal")}
                type="button"
              >
                Personal
              </button>
            </div>
          </div>
          <p className="report-updated">
            <Clock3 aria-hidden="true" size={14} />
            Last updated: May 16, 2025 <span aria-hidden="true">|</span> Data refreshes every 24 hours
          </p>
        </div>

        <label className="report-date-control">
          <CalendarDays aria-hidden="true" size={18} />
          <input aria-label="Report date" defaultValue="2025-05-16" type="date" />
        </label>
      </header>

      <section aria-label="Report summary" className="report-metrics-grid">
        {reportMetrics[activeView].map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="report-insights-grid">
        <article className="report-panel report-impact-panel">
          <div className="report-panel-header">
            <div>
              <h2>Project Impact</h2>
              <p>Active organizations</p>
            </div>
            <label className="report-select-control">
              <select
                aria-label="Select project"
                onChange={(event) => setSelectedProject(event.target.value)}
                value={selectedProject}
              >
                {projectSeries.map((project) => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" size={16} />
            </label>
          </div>
          <ImpactChart project={activeProject} />
          <div className="report-legend report-chart-legend">
            <span className="report-legend-dot report-legend-dot--green" />
            {activeProject.name}
          </div>
        </article>

        <article className="report-panel report-organizations-panel">
          <div className="report-panel-header">
            <div>
              <h2>Top Organizations</h2>
              <p className="report-link-copy">Active organizations</p>
            </div>
          </div>
          <div className="report-organization-list">
            {topOrganizations.map((organization, index) => (
              <div className="report-organization-row" key={organization.name}>
                <span className="report-organization-rank">{index + 1}</span>
                <span className="report-organization-icon"><Building2 aria-hidden="true" size={17} /></span>
                <span className="report-organization-name">
                  <strong>{organization.name}</strong>
                  <small><MapPin aria-hidden="true" size={11} />{organization.location}</small>
                </span>
                <span className="report-organization-count">
                  <strong>{organization.projects}</strong>
                  <small>projects</small>
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="report-panel report-map-panel">
        <div className="report-panel-header">
          <div>
            <h2>Project Impact</h2>
            <p>Active organizations</p>
          </div>
          <label className="report-select-control report-location-control">
            <select
              aria-label="Select map location"
              onChange={(event) => setSelectedLocation(event.target.value as keyof typeof locations)}
              value={selectedLocation}
            >
              {Object.entries(locations).map(([value, location]) => (
                <option key={value} value={value}>{location.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" size={16} />
          </label>
        </div>
        <ImpactMap selectedLocation={selectedLocation} />
        <div className="report-legend report-map-legend">
          <span className="report-legend-dot report-legend-dot--blue" /> Beneficiaries
          <span className="report-legend-dot report-legend-dot--green" /> Organizations
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
