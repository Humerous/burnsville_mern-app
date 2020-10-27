import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

// <---- LOGIN SCREEN FUNCTION - location, history, dispatch, setEmail, setPassword ---->
const LoginScreen = ({ location, history }) => {
  // <---- LOGIN - setEmail, setPassword state ---->
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // <---- LOGIN - dispatch state ---->
  const dispatch = useDispatch();

  // <---- LOGIN - userLogin state ---->
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  // <---- LOGIN - setEmail, redirect state ---->
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // <---- LOGIN EFFECT FOR USER INFO - userInfo, redirect   ---->
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  // <---- LOGIN FUNCTION - submitHandler ---->
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

// <---- EXPORT ---->
export default LoginScreen;
