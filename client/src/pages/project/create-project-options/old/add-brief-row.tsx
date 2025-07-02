import { Row, Col } from "react-bootstrap";

const AddBriefRow = ({ data, columns }) => {
  const columnStyles = {
    borderRight: "1px solid #767676",
  };

  return (
    <>
      <Row
        className="mb-3 text-white"
        style={{
          backgroundColor: "#7B80DD",
          borderRadius: "3px",
        }}
      >
        {columns.map((column, index) => (
            <Col
                key={index}
                className="p-2"
                style={{
                    borderRight: "1px solid white",
                }}
                lg = {column.width || 12}
            >
                {column.label}
            </Col>
            ))    
        }
      </Row>
      {data.map((item, index) => (
        <Row
          key={index}
          className="text-white"
          style={{
            backgroundColor: 'white',
            borderRadius: '3px',
            border: '1px solid #7B80DD',
          }}
        >
          {Object.keys(item).map((key, colIndex) => (
            <Col
              key={colIndex}
              className="p-2 text-dark"
              style={{
                ...(colIndex < Object.keys(item).length - 1 ? columnStyles : {}),
              }}
              lg = {columns[colIndex].width || 12}
            >
              {item[key]}
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
};

export default AddBriefRow;
