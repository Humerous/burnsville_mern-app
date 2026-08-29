import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();

  const hasShippingAddress = Boolean(
    shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      shippingAddress.country
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      history.replace('/cart');
      return;
    }

    if (!userInfo) {
      history.replace('/login?redirect=payment');
      return;
    }

    if (!hasShippingAddress) {
      history.replace('/shipping');
    }
  }, [cartItems.length, hasShippingAddress, history, userInfo]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  if (cartItems.length === 0 || !userInfo || !hasShippingAddress) {
    return null;
  }

  return (
    <section
      className='burnsville-checkout'
      aria-labelledby='burnsville-payment-title'
    >
      <Meta
        title='Payment Method | Burnsville'
        description='Select a payment method for your Burnsville order.'
      />

      <div className='burnsville-checkout__inner'>
        <CheckoutSteps step1 step2 step3 />

        <div className='burnsville-checkout__layout'>
          <header className='burnsville-checkout__introduction'>
            <p className='burnsville-checkout__eyebrow'>Checkout step 3</p>
            <h1 id='burnsville-payment-title'>Payment method</h1>
            <p>Select the available payment option.</p>
            <div className='burnsville-checkout__accent' aria-hidden='true' />
          </header>

          <form className='burnsville-checkout__form' onSubmit={submitHandler}>
            <fieldset className='burnsville-checkout__payment-options'>
              <legend>
                <span className='burnsville-checkout__eyebrow'>Payment option</span>
                Select method
              </legend>

              <label className='burnsville-checkout__payment-option' htmlFor='PayPal'>
                <input
                  type='radio'
                  id='PayPal'
                  name='paymentMethod'
                  value='PayPal'
                  checked={paymentMethod === 'PayPal'}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span className='burnsville-checkout__radio-mark' aria-hidden='true' />
                <span>
                  <strong>PayPal or Credit Card</strong>
                  <small>PayPal</small>
                </span>
              </label>
            </fieldset>

            <button type='submit'>Continue to review</button>
          </form>
        </div>
      </div>
    </section>
  );
};

PaymentScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default PaymentScreen;
