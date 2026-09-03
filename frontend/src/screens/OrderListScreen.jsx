import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listOrders } from '../actions/orderActions';
import './admin-order-list.css';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  return (
    <section
      className='burnsville-admin-orders'
      aria-labelledby='admin-orders-title'
    >
      <Meta
        title='Admin Orders | Burnsville'
        description='Review orders in the Burnsville admin workspace.'
      />

      <div className='burnsville-admin-orders__inner'>
        <header className='burnsville-admin-orders__header'>
          <div>
            <p className='burnsville-admin-orders__eyebrow'>Admin workspace</p>
            <h1 id='admin-orders-title'>Orders</h1>
            <p>Review order status and open existing order records.</p>
          </div>
        </header>

        <section
          className='burnsville-admin-orders__panel'
          aria-labelledby='admin-order-directory-title'
        >
          <div className='burnsville-admin-orders__panel-heading'>
            <div>
              <p className='burnsville-admin-orders__section-number'>01</p>
              <h2 id='admin-order-directory-title'>Order directory</h2>
            </div>
            {!loading && !error && (
              <span>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            )}
          </div>

          <div className='burnsville-admin-orders__panel-body'>
            {loading ? (
              <div
                className='burnsville-admin-orders__state'
                aria-label='Loading orders'
              >
                <Loader />
              </div>
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : orders.length === 0 ? (
              <div className='burnsville-admin-orders__empty'>
                <p className='burnsville-admin-orders__eyebrow'>
                  Order directory
                </p>
                <h3>No orders found</h3>
                <p>Orders will appear here when available.</p>
              </div>
            ) : (
              <div className='burnsville-admin-orders__table-wrap'>
                <table className='burnsville-admin-orders__table'>
                  <thead>
                    <tr>
                      <th scope='col'>ID</th>
                      <th scope='col'>User</th>
                      <th scope='col'>Date</th>
                      <th scope='col'>Total</th>
                      <th scope='col'>Paid</th>
                      <th scope='col'>Delivered</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td
                          className='burnsville-admin-orders__id'
                          data-label='ID'
                          title={order._id}
                        >
                          {order._id}
                        </td>
                        <td data-label='User'>
                          {order.user && order.user.name}
                        </td>
                        <td data-label='Date'>
                          {order.createdAt.substring(0, 10)}
                        </td>
                        <td data-label='Total'>${order.totalPrice}</td>
                        <td data-label='Paid'>
                          <span
                            className={`burnsville-admin-orders__status ${
                              order.isPaid
                                ? 'burnsville-admin-orders__status--complete'
                                : 'burnsville-admin-orders__status--pending'
                            }`}
                          >
                            {order.isPaid
                              ? order.paidAt.substring(0, 10)
                              : 'Not paid'}
                          </span>
                        </td>
                        <td data-label='Delivered'>
                          <span
                            className={`burnsville-admin-orders__status ${
                              order.isDelivered
                                ? 'burnsville-admin-orders__status--complete'
                                : 'burnsville-admin-orders__status--pending'
                            }`}
                          >
                            {order.isDelivered
                              ? order.deliveredAt.substring(0, 10)
                              : 'Not delivered'}
                          </span>
                        </td>
                        <td
                          className='burnsville-admin-orders__actions'
                          data-label='Actions'
                        >
                          <Link
                            className='burnsville-admin-orders__action'
                            to={`/order/${order._id}`}
                            aria-label={`View order ${order._id}`}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default OrderListScreen;
