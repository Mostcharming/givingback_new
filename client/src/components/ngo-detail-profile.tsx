import { Col, Container, Form, Image, Row } from 'react-bootstrap'

const NGOProfileDetail = ({ ngoData }: { ngoData: any }) => {
  return (
    <Container className='mt-4 admin-container'>
      <Row>
        <Col md={2} className='mt-5'>
          <Image
            fluid={true}
            src={ngoData.userimage?.filename}
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Col>
        <Col md={10}>
          <Form className='mt-5' id='form'>
            <Row>
              <Col lg='12'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='bvn'
                >
                  <Form.Label>Name of Organization</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={ngoData.name}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='account'
                >
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type='number'
                    required
                    value={ngoData.phone}
                    disabled
                  />
                </Form.Group>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='bank'
                >
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={ngoData.address[0].state}
                    disabled
                  />
                </Form.Group>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='bank'
                >
                  <Form.Label>City/LGA</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={ngoData.address[0].city_lga}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg='6'>
                <p>Areas of Interest</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {ngoData.interest_area.split(',').map((interest, index) => (
                    <li key={index}>{interest.trim()}</li>
                  ))}
                </ul>
              </Col>
              <Col lg='12'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='accountName'
                >
                  <Form.Label>Address of Organization</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={ngoData.address[0].address}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
export default NGOProfileDetail
