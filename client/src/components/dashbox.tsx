import React from 'react'
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap'

interface DashBoxItem {
  title: string
  amount: string
  iconClass: string
  bgColor: string
}

interface DashBoxProps {
  items: DashBoxItem[]
}

const DashBox: React.FC<DashBoxProps> = ({ items }) => {
  return (
    <>
      <div className='header bg-gradient-info pb-2 '>
        <Container fluid>
          <div className='header-body'>
            <Row>
              {items.map((item, index) => (
                <Col lg='6' xl='3' key={index}>
                  <Card className='card-stats mb-4 mb-xl-0'>
                    <CardBody
                      style={{
                        border: '1px solid #7B80DD',
                        borderRadius: '5px'
                      }}
                    >
                      <Row>
                        <div className='col'>
                          <CardTitle
                            tag='h5'
                            className='text-uppercase text-muted mb-0'
                          >
                            {item.title}
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0'>
                            {item.amount}
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div
                            className={`icon icon-shape ${item.bgColor} text-white rounded-circle shadow`}
                          >
                            <i className={item.iconClass} />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default DashBox
