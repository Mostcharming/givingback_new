import { Col, Container, Form, Image, Row } from 'react-bootstrap'
import { Banks } from '../services/banks'
// import { GetNGOResponse } from '../../../../../types/response'
// import { Banks } from '../../../../../utils/banks'

const NGOKYCDetail = ({ ngoData }: { ngoData: any }) => {
  const bankDetails =
    ngoData.bank && ngoData.bank.length > 0 ? ngoData.bank[0] : null

  return (
    <Container className='mt-4 admin-container'>
      <Row>
        <Col md={2} className='mt-5'>
          <Image
            fluid={true}
            src={ngoData.userimage?.filename || 'default-image-url'}
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
                  <Form.Label>Bank Verification Number (BVN)</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={bankDetails?.bvn || 'Not Available'}
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
                  <Form.Label>Bank Account Number</Form.Label>
                  <Form.Control
                    type='number'
                    required
                    value={bankDetails?.accountNumber || 'Not Available'}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='bank'
                >
                  <Form.Label>Bank</Form.Label>
                  <Form.Select
                    className='normal-text'
                    aria-label='Default select example'
                    required
                    value={bankDetails?.bankName || 'Not Available'}
                    disabled
                  >
                    <option>Select Banks</option>
                    {Banks.map((bank) => {
                      return (
                        <option key={bank.id} value={bank.name}>
                          {bank.name}
                        </option>
                      )
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg='12'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='accountName'
                >
                  <Form.Label>Bank Account Name</Form.Label>
                  <Form.Control
                    type='text'
                    required
                    value={bankDetails?.accountName || 'Not Available'}
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
export default NGOKYCDetail
