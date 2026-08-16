import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

// <---- USER PAYMENT SCREEN FUNCTION - history, dispatch, setQty, setRating, setComment ---->
const PaymentScreen = ({ history }) => {
  // <---- PAYMENT - cart state ---->
  const cart = useSelector((state) => state.cart);

  // <---- PAYMENT - shippingAddress cart state ---->
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  // <---- PAYMENT - setPaymentMethod state ---->
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // <---- PAYMENT ORDER  - dsipatch state ---->
  const dispatch = useDispatch();

  // <---- PAYMENT HANDLER - placeOrderHandler ---->
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type='radio'
              label='PayFast'
              id='PayFast'
              name='paymentMethod'
              value='PayFast'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

// <---- EXPORT ---->
export default PaymentScreen;
