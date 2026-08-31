import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';
import './order-screen.css';
import './payment-provider-options.css';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const [paypalConfigured, setPaypalConfigured] = useState(null);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const displayItemsPrice =
    order && order.itemsPrice !== undefined && order.itemsPrice !== null
      ? order.itemsPrice
      : order
      ? order.orderItems.reduce(
          (acc, item) => acc + item.price * item.qty,
          0
        )
      : 0;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    const addPayPalScript = async () => {
      try {
        const { data: clientId } = await axios.get('/api/config/paypal');

        if (!clientId || typeof clientId !== 'string' || !clientId.trim()) {
          setPaypalConfigured(false);
          return;
        }

        setPaypalConfigured(true);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        script.onerror = () => {
          setPaypalConfigured(false);
        };
        document.body.appendChild(script);
      } catch (paypalError) {
        setPaypalConfigured(false);
      }
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid && order.paymentMethod === 'PayPal') {
      if (!window.paypal && paypalConfigured !== false) {
        addPayPalScript();
      } else if (window.paypal) {
        setPaypalConfigured(true);
        setSdkReady(true);
      }
    }
  }, [
    history,
    dispatch,
    orderId,
    successPay,
    successDeliver,
    order,
    userInfo,
    paypalConfigured,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const renderPaymentControl = () => {
    if (order.paymentMethod === 'PayPal') {
      if (paypalConfigured === false) {
        return (
          <div className='burnsville-order__provider-notice'>
            <strong>PayPal</strong>
            <p>
              PayPal is selected, but this Preview does not currently have a
              usable PayPal client configuration. The order remains unpaid.
            </p>
          </div>
        );
      }

      if (loadingPay || !sdkReady) {
        return <Loader />;
      }

      return (
        <PayPalButton
          amount={order.totalPrice}
          onSuccess={successPaymentHandler}
        />
      );
    }

    if (order.paymentMethod === 'Peach Payments') {
      return (
        <div className='burnsville-order__provider-notice'>
          <strong>Peach Payments</strong>
          <p>
            Peach Payments is selected as the primary South African gateway.
            Merchant sandbox credentials and provider-side transaction
            verification are required before money can be processed. This
            Preview keeps the order unpaid until that activation is complete.
          </p>
        </div>
      );
    }

    if (order.paymentMethod === 'SnapScan') {
      return (
        <div className='burnsville-order__provider-notice'>
          <strong>SnapScan</strong>
          <p>
            SnapScan is selected for QR/mobile payment. A merchant SnapCode,
            API verification and webhook configuration are required before a
            payment can be confirmed. This Preview keeps the order unpaid.
          </p>
        </div>
      );
    }

    return (
      <div className='burnsville-order__provider-notice'>
        <strong>Payment setup required</strong>
        <p>The selected payment method is not supported by this checkout.</p>
      </div>
    );
  };

  return loading ? (
    <section className='burnsville-order-state' aria-label='Loading order'>
      <Loader />
    </section>
  ) : error ? (
    <section className='burnsville-order-state burnsville-order-state--error'>
      <Message variant='danger'>{error}</Message>
    </section>
  ) : (
    <section
      className='burnsville-order'
      aria-labelledby='burnsville-order-title'
    >
      <Meta
        title={`Order ${order._id} | Burnsville`}
        description='View the current details and status of your Burnsville order.'
      />

      <div className='burnsville-order__inner'>
        <header className='burnsville-order__header'>
          <div>
            <p className='burnsville-order__eyebrow'>Order status</p>
            <h1 id='burnsville-order-title'>Your order</h1>
            <p className='burnsville-order__reference'>Order {order._id}</p>
          </div>

          <div className='burnsville-order__status-overview' aria-label='Order status summary'>
            <span className={order.isPaid ? 'is-complete' : 'is-pending'}>
              {order.isPaid ? 'Paid' : 'Not paid'}
            </span>
            <span className={order.isDelivered ? 'is-complete' : 'is-pending'}>
              {order.isDelivered ? 'Delivered' : 'Not delivered'}
            </span>
          </div>
        </header>

        <div className='burnsville-order__layout'>
          <div className='burnsville-order__details'>
            <div className='burnsville-order__overview'>
              <section aria-labelledby='burnsville-order-shipping'>
                <p className='burnsville-order__section-number'>01</p>
                <h2 id='burnsville-order-shipping'>Shipping</h2>
                <dl className='burnsville-order__information'>
                  <div>
                    <dt>Name</dt>
                    <dd>{order.user.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>
                      {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                      {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </dd>
                  </div>
                </dl>
                <div className='burnsville-order__message'>
                  {order.isDelivered ? (
                    <Message variant='success'>
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </div>
              </section>

              <section aria-labelledby='burnsville-order-payment'>
                <p className='burnsville-order__section-number'>02</p>
                <h2 id='burnsville-order-payment'>Payment method</h2>
                <dl className='burnsville-order__information'>
                  <div>
                    <dt>Method</dt>
                    <dd>{order.paymentMethod}</dd>
                  </div>
                </dl>
                <div className='burnsville-order__message'>
                  {order.isPaid ? (
                    <Message variant='success'>Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </div>
              </section>
            </div>

            <section
              className='burnsville-order__items-panel'
              aria-labelledby='burnsville-order-items'
            >
              <div className='burnsville-order__section-heading'>
                <div>
                  <p className='burnsville-order__section-number'>03</p>
                  <h2 id='burnsville-order-items'>Order items</h2>
                </div>
                <span>{order.orderItems.length} items</span>
              </div>

              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ul className='burnsville-order__items'>
                  {order.orderItems.map((item, index) => (
                    <li className='burnsville-order__item' key={index}>
                      <div className='burnsville-order__image-wrap'>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className='burnsville-order__item-details'>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <span>Quantity {item.qty}</span>
                      </div>
                      <p className='burnsville-order__item-price'>
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
            className='burnsville-order__summary'
            aria-labelledby='burnsville-order-summary'
          >
            <p className='burnsville-order__eyebrow'>Order total</p>
            <h2 id='burnsville-order-summary'>Order summary</h2>

            <dl className='burnsville-order__totals'>
              <div>
                <dt>Items</dt>
                <dd>R{addDecimals(displayItemsPrice)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>R{order.shippingPrice}</dd>
              </div>
              <div>
                <dt>VAT</dt>
                <dd>R{order.vatPrice}</dd>
              </div>
              <div className='burnsville-order__total'>
                <dt>Total</dt>
                <dd>R{order.totalPrice}</dd>
              </div>
            </dl>

            {!order.isPaid && (
              <div className='burnsville-order__payment-control'>
                {renderPaymentControl()}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className='burnsville-order__delivery-control'>
                  <button type='button' onClick={deliverHandler}>
                    Mark As Delivered
                  </button>
                </div>
              )}
          </aside>
        </div>
      </div>
    </section>
  );
};

OrderScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OrderScreen;
