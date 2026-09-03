import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import './profile-screen.css';

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (!user || !user.name || success) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetails('profile'));
      dispatch(listMyOrders());
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <section className='burnsville-profile' aria-labelledby='profile-page-title'>
      <Meta
        title='My Account | Burnsville'
        description='Manage your Burnsville account and review your orders.'
      />

      <div className='burnsville-profile__inner'>
        <header className='burnsville-profile__header'>
          <p className='burnsville-profile__eyebrow'>Account</p>
          <h1 id='profile-page-title'>My profile</h1>
          <p>Update your account details and review your order history.</p>
        </header>

        <div className='burnsville-profile__layout'>
          <section
            className='burnsville-profile__panel burnsville-profile__details'
            aria-labelledby='profile-details-title'
          >
            <div className='burnsville-profile__section-heading'>
              <div>
                <p className='burnsville-profile__section-number'>01</p>
                <h2 id='profile-details-title'>Profile details</h2>
              </div>
              <span>Customer account</span>
            </div>

            <div className='burnsville-profile__panel-body'>
              {message && <Message variant='danger'>{message}</Message>}
              {success && <Message variant='success'>Profile Updated</Message>}
              {loading ? (
                <div className='burnsville-profile__state' aria-label='Loading profile'>
                  <Loader />
                </div>
              ) : error ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form className='burnsville-profile__form' onSubmit={submitHandler}>
                  <div className='burnsville-profile__field'>
                    <label htmlFor='profile-name'>Name</label>
                    <input
                      id='profile-name'
                      type='name'
                      placeholder='Enter name'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <div className='burnsville-profile__field'>
                    <label htmlFor='profile-email'>Email address</label>
                    <input
                      id='profile-email'
                      type='email'
                      placeholder='Enter email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>

                  <div className='burnsville-profile__field'>
                    <label htmlFor='profile-password'>Password</label>
                    <input
                      id='profile-password'
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <div className='burnsville-profile__field'>
                    <label htmlFor='profile-confirm-password'>Confirm password</label>
                    <input
                      id='profile-confirm-password'
                      type='password'
                      placeholder='Confirm password'
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  <button type='submit'>Update profile</button>
                </form>
              )}
            </div>
          </section>

          <section
            className='burnsville-profile__panel burnsville-profile__orders'
            aria-labelledby='profile-orders-title'
          >
            <div className='burnsville-profile__section-heading'>
              <div>
                <p className='burnsville-profile__section-number'>02</p>
                <h2 id='profile-orders-title'>My orders</h2>
              </div>
              {!loadingOrders && !errorOrders && (
                <span>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
              )}
            </div>

            <div className='burnsville-profile__orders-body'>
              {loadingOrders ? (
                <div className='burnsville-profile__state' aria-label='Loading orders'>
                  <Loader />
                </div>
              ) : errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
              ) : orders.length === 0 ? (
                <div className='burnsville-profile__empty'>
                  <p className='burnsville-profile__eyebrow'>Order history</p>
                  <h3>No orders yet</h3>
                  <p>Your completed orders will appear here.</p>
                  <Link to='/shop'>Browse sauces</Link>
                </div>
              ) : (
                <div className='burnsville-profile__table-wrap'>
                  <table className='burnsville-profile__table'>
                    <thead>
                      <tr>
                        <th scope='col'>Order</th>
                        <th scope='col'>Date</th>
                        <th scope='col'>Total</th>
                        <th scope='col'>Paid</th>
                        <th scope='col'>Delivered</th>
                        <th scope='col'><span className='sr-only'>Order details</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td data-label='Order' className='burnsville-profile__order-id'>
                            {order._id}
                          </td>
                          <td data-label='Date'>{order.createdAt.substring(0, 10)}</td>
                          <td data-label='Total'>{order.totalPrice}</td>
                          <td data-label='Paid'>
                            <span className={order.isPaid ? 'is-complete' : 'is-pending'}>
                              {order.isPaid ? order.paidAt.substring(0, 10) : 'Not paid'}
                            </span>
                          </td>
                          <td data-label='Delivered'>
                            <span className={order.isDelivered ? 'is-complete' : 'is-pending'}>
                              {order.isDelivered
                                ? order.deliveredAt.substring(0, 10)
                                : 'Not delivered'}
                            </span>
                          </td>
                          <td className='burnsville-profile__details-link'>
                            <Link to={`/order/${order._id}`}>Details</Link>
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
      </div>
    </section>
  );
};

export default ProfileScreen;
