import { Search } from "lucide-react";
import { Col, Container, Row } from "reactstrap";
import { STYLES } from "./ProjectsStyles";
import type { Area } from "./ProjectsTypes";

export const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <Col lg="3" md="12">
    <div style={STYLES.searchInputWrapper}>
      <Search size={18} style={STYLES.searchIcon} />
      <input
        type="text"
        className="form-control"
        placeholder="Search project/brief"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={STYLES.searchInput as React.CSSProperties}
      />
    </div>
  </Col>
);

export const CategoryFilter = ({
  selectedCategory,
  areas,
  onCategoryChange,
}: {
  selectedCategory: string;
  areas: Area[];
  onCategoryChange: (category: string) => void;
}) => (
  <Col lg="3" md="12">
    <div className="dropdown" style={STYLES.dropdown}>
      <button
        className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
        role="button"
        id="dropdownMenuCategoryLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={STYLES.dropdownButton as React.CSSProperties}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "#212529";
        }}
      >
        <span>{selectedCategory}</span>
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
  </Col>
);

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  areas,
  onCategoryChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  areas: Area[];
  onCategoryChange: (category: string) => void;
}) => (
  <div className="pb-4" style={STYLES.filterContainer}>
    <Container fluid>
      <Row className="g-3">
        <SearchInput value={searchQuery} onChange={onSearchChange} />
        <CategoryFilter
          selectedCategory={categoryFilter}
          areas={areas}
          onCategoryChange={onCategoryChange}
        />
        <Col lg="6" md="12" />
      </Row>
    </Container>
  </div>
);
