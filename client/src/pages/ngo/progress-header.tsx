import { Row, Col } from 'react-bootstrap'

interface ProgressHeaderProps {
  page: number
  headers: string[]
  onClickHeader?: any
}

const ProgressHeader = ({
  page,
  headers,
  onClickHeader
}: ProgressHeaderProps) => {
  const columns = Math.round(12 / headers.length)

  return (
    <div className='mb-5'>
      <Row className='mt-3 justify-content-center'>
        {headers.map((header, index) => (
          <Col
            xs={columns}
            className='px-1'
            key={index}
            onClick={() => onClickHeader(index + 1)}
          >
            <div
              className='d-flex align-items-center justify-content-center'
              style={{
                borderBottom: '6px solid',
                borderColor: page < index + 1 ? 'grey' : '#4BBF52'
              }}
            >
              <div
                className='d-flex align-items-center justify-content-center mb-3 progress-header-circle'
                style={{
                  backgroundColor: page < index + 1 ? 'white' : '#4BBF52',
                  color: page < index + 1 ? '#4BBF52' : 'white'
                }}
              >
                {page > index + 1 ? '\u2713' : index + 1}
              </div>
              <label className='mb-3 ms-2 progress-header-label'>
                {header}
              </label>
            </div>
          </Col>
        ))}
        {/* <Col xs={3} className="px-1">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ borderBottom: "6px solid #000", borderColor: "#4BBF52" }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 progress-header-circle"
            >
              {page > 1 ? "\u2713" : 1}
            </div>
            <label className="mb-3 ms-2 progress-header-label">Project Details</label>
          </div>
        </Col>
        <Col xs={3} className="px-1">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              borderBottom: "6px solid",
              borderColor: page < 2 ? "grey" : "#4BBF52",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 progress-header-circle"
              style={{
                backgroundColor: page < 2 ? "white" : "#4BBF52",
                color: page < 2 ? "#4BBF52" : "white",
              }}
            >
              {page > 2 ? "\u2713" : 2}
            </div>
            <label className="mb-3 ms-2 progress-header-label">Sponsors</label>
          </div>
        </Col>
        <Col xs={3} className="px-1">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              borderBottom: "6px solid",
              borderColor: page < 3 ? "grey" : "#4BBF52",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 progress-header-circle"
              style={{
                backgroundColor: page < 3 ? "white" : "#4BBF52",
                color: page < 3 ? "#4BBF52" : "white",
              }}
            >
              {page > 3 ? "\u2713" : 3}
            </div>
            <label className="mb-3 ms-2 progress-header-label">Beneficiaries</label>
          </div>
        </Col>
        <Col xs={3} className="px-1">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              borderBottom: "6px solid",
              borderColor: page < 4 ? "grey" : "#4BBF52",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 progress-header-circle"
              style={{
                backgroundColor: page < 4 ? "white" : "#4BBF52",
                color: page < 4 ? "#4BBF52" : "white",
              }}
            >
              {page > 4 ? "\u2713" : 4}
            </div>
            <label className="mb-3 ms-2 progress-header-label">Media</label>
          </div>
        </Col> */}
      </Row>
    </div>
  )
}

export default ProgressHeader
