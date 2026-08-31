import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Meta from '../components/Meta';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { CART_RESET } from '../constants/cartConstants';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import './place-order-screen.css';

const SUPPORTED_PAYMENT_METHODS = [
  'Credit / Cheque Card',
  'Peach Payments',
  'SnapScan',
  'Zapper',
  'PayPal',
];

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = Number(
    addDecimals(
      cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 100;
  const vatPrice = Number(addDecimals(0.15 * itemsPrice));
  const totalPrice = Number(
    addDecimals(itemsPrice + shippingPrice + vatPrice)
  );

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  const hasShippingAddress = Boolean(
    cart.shippingAddress.address &&
      cart.shippingAddress.city &&
      cart.shippingAddress.postalCode &&
      cart.shippingAddress.country
  );
  const hasSupportedPaymentMethod = SUPPORTED_PAYMENT_METHODS.includes(
    cart.paymentMethod
  );
  const checkoutReady = Boolean(
    userInfo &&
      cart.cartItems.length > 0 &&
      hasShippingAddress &&
      hasSupportedPaymentMethod
  );

  useEffect(() => {
    if (success && order) {
      const orderId = order._id;

      history.replace(`/order/${orderId}`);
      dispatch({ type: CART_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      return;
    }

    if (cart.cartItems.length === 0) {
      history.replace('/cart');
      return;
    }

    if (!userInfo) {
      history.replace('/login?redirect=placeorder');
      return;
    }

    if (!hasShippingAddress) {
      history.replace('/shipping');
      return;
    }

    if (!hasSupportedPaymentMethod) {
      history.replace('/payment');
    }
  }, [
    cart.cartItems.length,
    dispatch,
    hasShippingAddress,
    hasSupportedPaymentMethod,
    history,
    order,
    success,
    userInfo,
  ]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems.map((item) => ({
          product: item.product,
          qty: item.qty,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      })
    );
  };

  if (!checkoutReady || (success && order)) {
    return null;
  }

  return (
    <section
      className='burnsville-place-order'
      aria-labelledby='burnsville-place-order-title'
    >
      <Meta
        title='Review Order | Burnsville'
        description='Review the details of your Burnsville order before placing it.'
      />

      <div className='burnsville-place-order__inner'>
        <CheckoutSteps step1 step2 step3 step4 />

        <header className='burnsville-place-order__header'>
          <div>
            <p className='burnsville-place-order__eyebrow'>Final checkout step</p>
            <h1 id='burnsville-place-order-title'>Review your order</h1>
          </div>
          <p>Check the order details below before placing your order.</p>
        </header>

        <div className='burnsville-place-order__layout'>
          <div className='burnsville-place-order__details'>
            <div className='burnsville-place-order__overview'>
              <section aria-labelledby='burnsville-shipping-summary'>
                <p className='burnsville-place-order__section-number'>01</p>
                <h2 id='burnsville-shipping-summary'>Shipping</h2>
                <p>
                  <strong>Address:</strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </section>

              <section aria-labelledby='burnsville-payment-summary'>
                <p className='burnsville-place-order__section-number'>02</p>
                <h2 id='burnsville-payment-summary'>Payment method</h2>
                <p>
                  <strong>Method: </strong>
                  {cart.paymentMethod}
                </p>
              </section>
            </div>

            <section
              className='burnsville-place-order__items-panel'
              aria-labelledby='burnsville-order-items'
            >
              <div className='burnsville-place-order__section-heading'>
                <div>
                  <p className='burnsville-place-order__section-number'>03</p>
                  <h2 id='burnsville-order-items'>Order items</h2>
                </div>
                <span>{cart.cartItems.length} items</span>
              </div>

              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ul className='burnsville-place-order__items'>
                  {cart.cartItems.map((item, index) => (
                    <li className='burnsville-place-order__item' key={index}>
                      <div className='burnsville-place-order__image-wrap'>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className='burnsville-place-order__item-details'>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <span>Quantity {item.qty}</span>
                      </div>
                      <p className='burnsville-place-order__item-price'>
                        <span>
                          {item.qty} x R{item.price}
                        </span>
                        <strong>R{addDecimals(item.qty * item.price)}</strong>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside
            className='burnsville-place-order__summary'
            aria-labelledby='burnsville-order-summary'
          >
            <p className='burnsville-place-order__eyebrow'>Order total</p>
            <h2 id='burnsville-order-summary'>Order summary</h2>

            <dl>
              <div>
                <dt>Items</dt>
                <dd>R{addDecimals(itemsPrice)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>R{addDecimals(shippingPrice)}</dd>
              </div>
              <div>
                <dt>VAT</dt>
                <dd>R{addDecimals(vatPrice)}</dd>
              </div>
              <div className='burnsville-place-order__total'>
                <dt>Total</dt>
                <dd>R{addDecimals(totalPrice)}</dd>
              </div>
            </dl>

            {error && (
              <div className='burnsville-place-order__error'>
                <Message variant='danger'>{error}</Message>
              </div>
            )}

            <button
              type='button'
              disabled={loading || cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

PlaceOrderScreen.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlaceOrderScreen;
