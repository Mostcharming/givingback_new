/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProjectFiltersProps {
  statusFilter: string;
  categoryFilter: string;
  dateFilter: string;
  areas: any[];
  role: string | undefined;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (date: string) => void;
  locationFilter?: string;
  onLocationChange?: (location: string) => void;
}

export const ProjectFilters = ({
  statusFilter,
  categoryFilter,
  dateFilter,
  areas,
  role,
  onStatusChange,
  onCategoryChange,
  onDateChange,
  locationFilter = "All locations",
  onLocationChange,
}: ProjectFiltersProps) => {
  const isDonorOrCorporate = role === "donor" || role === "corporate";

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  return (
    <div
      style={{
        border: "1px solid rgb(179, 179, 179)",
        borderRadius: "10px",
      }}
      className="container-fluid p-3"
    >
      <div className="row">
        {/* Status Filter - Only show for NGO and Admin */}
        {!isDonorOrCorporate && (
          <div className="mr-2">
            <div>
              <label className="form-label text-muted small fw-normal">
                Status
              </label>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgb(179, 179, 179)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#212529",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#212529")}
              >
                <span>{statusFilter}</span>
              </button>
              <ul className="dropdown-menu w-100">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onStatusChange("All Projects")}
                    style={{ color: "#212529 !important" }}
                  >
                    All Projects
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onStatusChange("active")}
                    style={{ color: "#212529 !important" }}
                  >
                    Active
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onStatusChange("completed")}
                    style={{ color: "#212529 !important" }}
                  >
                    Completed
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onStatusChange("closed")}
                    style={{ color: "#212529 !important" }}
                  >
                    Closed
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mr-2">
          <div>
            <label className="form-label text-muted small fw-normal">
              Category
            </label>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{
                backgroundColor: "white",
                border: "1px solid rgb(179, 179, 179)",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#212529",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#212529")}
            >
              <span>{categoryFilter}</span>
            </button>
            <ul className="dropdown-menu w-100">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => onCategoryChange("All Categories")}
                >
                  All Categories
                </button>
              </li>
              {areas?.map((area) => (
                <li key={area.id}>
                  <button
                    className="dropdown-item"
                    onClick={() => onCategoryChange(area.name)}
                  >
                    {area.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Date Filter */}
        <div className="">
          <div>
            <label className="form-label text-muted small fw-normal">
              Date
            </label>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              style={{
                backgroundColor: "white",
                border: "1px solid rgb(179, 179, 179)",
                borderRadius: "8px",
                padding: "24px 16px",
                color:
                  dateFilter === "Any time" || !dateFilter
                    ? "#6c757d"
                    : "#212529",
              }}
            />
            {(!dateFilter || dateFilter === "Any time") && (
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  pointerEvents: "none",
                  fontSize: "14px",
                }}
              >
                Any time
              </span>
            )}
          </div>
        </div>

        {/* Location Filter - Only show for Donor and Corporate */}
        {isDonorOrCorporate && (
          <div className="ml-2">
            <div>
              <label className="form-label text-muted small fw-normal">
                Location
              </label>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                role="button"
                id="dropdownMenuLocationLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgb(179, 179, 179)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#212529",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#212529")}
              >
                <span>{locationFilter}</span>
              </button>
              <ul className="dropdown-menu w-100">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onLocationChange?.("All locations")}
                    style={{ color: "#212529 !important" }}
                  >
                    All locations
                  </button>
                </li>
                {nigerianStates.map((state) => (
                  <li key={state}>
                    <button
                      className="dropdown-item"
                      onClick={() => onLocationChange?.(state)}
                      style={{ color: "#212529 !important" }}
                    >
                      {state}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="row"></div>
    </div>
  );
};
