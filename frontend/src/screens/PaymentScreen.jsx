import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { savePaymentMethod } from '../actions/cartActions';
import './payment-provider-options.css';

const PAYMENT_METHODS = [
  {
    id: 'Credit / Cheque Card',
    title: 'Credit / Cheque Card',
    detail: 'Visa / Mastercard',
    note: 'Card checkout through Peach Payments',
  },
  {
    id: 'Peach Payments',
    title: 'Peach Payments',
    detail: 'Bank / wallet checkout',
    note: 'Direct Peach payment option',
  },
  {
    id: 'PayFast',
    title: 'PayFast',
    detail: 'Online payment gateway',
    note: 'South African payment provider',
  },
  {
    id: 'SnapScan',
    title: 'SnapScan',
    detail: 'Scan to pay',
    note: 'South African QR and mobile payment option',
  },
  {
    id: 'Zapper',
    title: 'Zapper',
    detail: 'QR / mobile payment',
    note: 'South African mobile payment option',
  },
];

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const savedPaymentMethod = PAYMENT_METHODS.some(
    (method) => method.id === cart.paymentMethod
  )
    ? cart.paymentMethod
    : 'Credit / Cheque Card';
  const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod);
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
            <p>Select how you want to pay for this order.</p>
            <div className='burnsville-checkout__accent' aria-hidden='true' />
          </header>

          <form className='burnsville-checkout__form' onSubmit={submitHandler}>
            <fieldset className='burnsville-checkout__payment-options'>
              <legend>
                <span className='burnsville-checkout__eyebrow'>Payment options</span>
                Select method
              </legend>

              {PAYMENT_METHODS.map((method) => (
                <label
                  className='burnsville-checkout__payment-option'
                  htmlFor={method.id}
                  key={method.id}
                >
                  <input
                    type='radio'
                    id={method.id}
                    name='paymentMethod'
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span
                    className='burnsville-checkout__radio-mark'
                    aria-hidden='true'
                  />
                  <span className='burnsville-checkout__payment-option-copy'>
                    <strong>{method.title}</strong>
                    <small>{method.detail}</small>
                    <small>{method.note}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            <p className='burnsville-checkout__payment-note'>
              Payment remains unpaid until the selected provider confirms the
              transaction. Sandbox or live merchant credentials are required
              before a provider can process money.
            </p>

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
