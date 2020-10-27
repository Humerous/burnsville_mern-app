import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// <---- FOOTER FUNCTION  ---->
const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            Copyright &copy;{' '}
            <span role='img' aria-label='sheep'>
              🌶️ Burnsville
            </span>
            , Inc.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

// <---- EXPORT ---->
export default Footer;
