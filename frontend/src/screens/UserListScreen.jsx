import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listUsers, deleteUser } from '../actions/userActions';
import { USER_DELETE_REQUEST } from '../constants/userConstants';
import './admin-users.css';

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch({ type: USER_DELETE_REQUEST });
      dispatch(listUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, successDelete, history, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <section
      className='burnsville-admin-users burnsville-admin-users--list'
      aria-labelledby='admin-users-title'
    >
      <Meta
        title='Admin Users | Burnsville'
        description='Manage Burnsville customer and administrator accounts.'
      />

      <div className='burnsville-admin-users__inner'>
        <header className='burnsville-admin-users__header'>
          <div>
            <p className='burnsville-admin-users__eyebrow'>Admin workspace</p>
            <h1 id='admin-users-title'>Users</h1>
            <p>Review account access and maintain user records.</p>
          </div>
          {!loading && !error && (
            <span className='burnsville-admin-users__count'>
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          )}
        </header>

        <section
          className='burnsville-admin-users__panel'
          aria-labelledby='admin-users-table-title'
        >
          <div className='burnsville-admin-users__panel-heading'>
            <div>
              <p className='burnsville-admin-users__section-number'>01</p>
              <h2 id='admin-users-table-title'>User directory</h2>
            </div>
            <span>Account administration</span>
          </div>

          <div className='burnsville-admin-users__panel-body'>
            {loading ? (
              <div className='burnsville-admin-users__state' aria-label='Loading users'>
                <Loader />
              </div>
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : users.length === 0 ? (
              <div className='burnsville-admin-users__empty'>
                <p className='burnsville-admin-users__eyebrow'>User directory</p>
                <h3>No users found</h3>
                <p>User accounts will appear here when available.</p>
              </div>
            ) : (
              <div className='burnsville-admin-users__table-wrap'>
                <table className='burnsville-admin-users__table'>
                  <thead>
                    <tr>
                      <th scope='col'>ID</th>
                      <th scope='col'>Name</th>
                      <th scope='col'>Email</th>
                      <th scope='col'>Access</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td
                          className='burnsville-admin-users__id'
                          data-label='ID'
                          title={user._id}
                        >
                          {user._id}
                        </td>
                        <td data-label='Name'>{user.name}</td>
                        <td data-label='Email'>
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </td>
                        <td data-label='Access'>
                          <span
                            className={`burnsville-admin-users__status ${
                              user.isAdmin ? 'is-admin' : 'is-customer'
                            }`}
                          >
                            {user.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td
                          className='burnsville-admin-users__actions'
                          data-label='Actions'
                        >
                          <Link
                            className='burnsville-admin-users__action burnsville-admin-users__action--edit'
                            to={`/admin/user/${user._id}/edit`}
                            aria-label={`Edit ${user.name}`}
                          >
                            Edit
                          </Link>
                          <button
                            className='burnsville-admin-users__action burnsville-admin-users__action--delete'
                            onClick={() => deleteHandler(user._id)}
                            type='button'
                            aria-label={`Delete ${user.name}`}
                          >
                            Delete
                          </button>
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

export default UserListScreen;
