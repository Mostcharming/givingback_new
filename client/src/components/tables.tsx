import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";

const Tables = ({
  tableName,
  headers,
  data,
  isPagination = true,
  actions = [],
  emptyStateContent = "No data available",
  emptyStateButtonLabel = "Add Data",
  onEmptyStateButtonClick = () => {},
  filter = null,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const StatusBadge = ({ status }) => {
    const baseStyle = {
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: 500,
      fontSize: "0.875rem",
      textTransform: "capitalize",
    };

    const normalizedStatus = status?.toLowerCase();

    const styles = {
      completed: { bgColor: "#EDF7ED", color: "#128330" },
      pending: { bgColor: "#FFF4E5", color: "#F79009" },
      success: { bgColor: "#E6F4FF", color: "#1570EF" },
      failed: { bgColor: "#FDECEC", color: "#D92D20" },
    };

    const { bgColor: bg = "#F0F0F0", color: c = "#333" } =
      styles[normalizedStatus] || {};

    return (
      <span
        style={{
          ...baseStyle,
          backgroundColor: bg,
          color: c,
          textTransform: "capitalize" as React.CSSProperties["textTransform"],
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <Container className="mt-3" fluid>
      <Row>
        <div className="col">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {filter && filter()}
          </div>

          <Card className="shadow">
            <CardHeader
              style={{ display: "flex", justifyContent: "space-between" }}
              className="border-0"
            >
              <h3 className="mb-0">{tableName}</h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      style={{ background: "#EAF1F0" }}
                      scope="col"
                    >
                      {header}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th style={{ background: "#EAF1F0" }} scope="col">
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row)
                        .filter((key) => key !== "id") // Exclude the 'id' field
                        .map((key, colIndex) => (
                          <td key={colIndex}>
                            {key === "status1" ? (
                              <Badge color="" className={`badge-dot mr-4`}>
                                <i className={`bg-${row[key].color}`} />
                                {row[key].label}
                              </Badge>
                            ) : key === "completion" ? (
                              <div className="d-flex align-items-center">
                                <span className="mr-2">{row[key]}%</span>
                                <Progress
                                  max="100"
                                  value={row[key]}
                                  barClassName="bg-success"
                                />
                              </div>
                            ) : key === "tstatus" ? (
                              <div className="d-flex align-items-center">
                                <StatusBadge status={row[key]} />
                              </div>
                            ) : key === "transactionNo" ? (
                              <div className="d-flex align-items-center gap-2">
                                {(() => {
                                  const type = row.type?.toLowerCase();
                                  if (type?.includes("fund"))
                                    return (
                                      <div
                                        style={{
                                          color: "white",
                                          padding: "0px 5px",
                                          backgroundColor: "#128330",
                                          marginRight: "0.2rem",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <ArrowDownFromLine size={15} />
                                      </div>
                                    );
                                  if (type?.includes("withdrawal"))
                                    return (
                                      <div
                                        style={{
                                          color: "white",
                                          padding: "0px 5px",
                                          backgroundColor: "red",
                                          marginRight: "0.2rem",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <ArrowUpFromLine size={15} />
                                      </div>
                                    );
                                  if (type?.includes("donated"))
                                    return (
                                      <div
                                        style={{
                                          color: "white",
                                          padding: "0px 5px",
                                          backgroundColor: "red",
                                          marginRight: "0.2rem",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <ArrowUpFromLine size={15} />
                                      </div>
                                    );
                                  return (
                                    <div
                                      style={{
                                        color: "white",
                                        padding: "0px 5px",
                                        backgroundColor: "#128330",
                                        marginRight: "0.2rem",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      <ArrowDownFromLine size={15} />
                                    </div>
                                  );
                                })()}
                                <span>{row[key]}</span>
                              </div>
                            ) : (
                              row[key]
                            )}
                          </td>
                        ))}
                      {actions.length > 0 && (
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only"
                              href="#"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              {actions.map((action, actionIndex) => (
                                <DropdownItem
                                  key={actionIndex}
                                  onClick={() => action.onClick(row)}
                                >
                                  {action.label}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length + (actions.length > 0 ? 1 : 0)}>
                      <div className="text-center py-2">
                        <h4>{emptyStateContent}</h4>
                        <Button
                          style={{ backgroundColor: "#128330" }}
                          className="mt-2"
                          onClick={onEmptyStateButtonClick}
                        >
                          {emptyStateButtonLabel}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {isPagination && data.length > 0 && (
              <CardFooter>
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink href="#" onClick={handlePrevious}>
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i} active={currentPage === i + 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink href="#" onClick={handleNext}>
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            )}
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default Tables;
