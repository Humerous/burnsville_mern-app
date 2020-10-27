import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// <---- FORMCONTAINER FUNCTION - children ---->
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

// <---- EXPORT ---->
export default FormContainer;
