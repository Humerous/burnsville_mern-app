import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Meta from '../components/Meta';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import './place-order-screen.css';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.vatPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.vatPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        vatPrice: cart.vatPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

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
                        <strong>R{parseInt(item.qty * item.price)}</strong>
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
                <dd>R{cart.itemsPrice}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>R{cart.shippingPrice}</dd>
              </div>
              <div>
                <dt>VAT</dt>
                <dd>R{cart.vatPrice}</dd>
              </div>
              <div className='burnsville-place-order__total'>
                <dt>Total</dt>
                <dd>R{cart.totalPrice}</dd>
              </div>
            </dl>

            {error && (
              <div className='burnsville-place-order__error'>
                <Message variant='danger'>{error}</Message>
              </div>
            )}

            <button
              type='button'
              disabled={cart.cartItems === 0}
              onClick={placeOrderHandler}
            >
              Place order
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

PlaceOrderScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default PlaceOrderScreen;
