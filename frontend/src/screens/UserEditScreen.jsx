import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import './admin-users.css';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist');
    } else if (!user.name || user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, history, userId, user, successUpdate]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <section
      className='burnsville-admin-users burnsville-admin-users--edit'
      aria-labelledby='admin-user-edit-title'
    >
      <Meta
        title='Edit User | Burnsville'
        description='Update a Burnsville user account.'
      />

      <div className='burnsville-admin-users__inner burnsville-admin-users__inner--edit'>
        <Link className='burnsville-admin-users__back-link' to='/admin/userlist'>
          Back to users
        </Link>

        <header className='burnsville-admin-users__header'>
          <div>
            <p className='burnsville-admin-users__eyebrow'>Admin workspace</p>
            <h1 id='admin-user-edit-title'>Edit user</h1>
            <p>Update account identity and administrator access.</p>
          </div>
          <span className='burnsville-admin-users__reference'>ID {userId}</span>
        </header>

        <section
          className='burnsville-admin-users__panel burnsville-admin-users__edit-panel'
          aria-labelledby='admin-user-details-title'
        >
          <div className='burnsville-admin-users__panel-heading'>
            <div>
              <p className='burnsville-admin-users__section-number'>01</p>
              <h2 id='admin-user-details-title'>Account details</h2>
            </div>
            <span>User administration</span>
          </div>

          <div className='burnsville-admin-users__edit-body'>
            {loadingUpdate && (
              <div className='burnsville-admin-users__inline-loader'>
                <Loader />
              </div>
            )}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

            {loading ? (
              <div className='burnsville-admin-users__state' aria-label='Loading user'>
                <Loader />
              </div>
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <form className='burnsville-admin-users__form' onSubmit={submitHandler}>
                <div className='burnsville-admin-users__field'>
                  <label htmlFor='admin-user-name'>Name</label>
                  <input
                    id='admin-user-name'
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className='burnsville-admin-users__field'>
                  <label htmlFor='admin-user-email'>Email address</label>
                  <input
                    id='admin-user-email'
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <label className='burnsville-admin-users__checkbox' htmlFor='admin-user-isadmin'>
                  <input
                    id='admin-user-isadmin'
                    type='checkbox'
                    checked={isAdmin}
                    onChange={(event) => setIsAdmin(event.target.checked)}
                  />
                  <span aria-hidden='true' />
                  <strong>Administrator access</strong>
                  <small>Allow this user to access existing admin controls.</small>
                </label>

                <button type='submit'>Update user</button>
              </form>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserEditScreen;
