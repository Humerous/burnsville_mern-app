import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { login } from '../actions/userActions';
import './account-auth.css';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <section
      className='burnsville-account-auth'
      aria-labelledby='burnsville-login-title'
    >
      <Meta
        title='Sign In | Burnsville'
        description='Sign in to your Burnsville account.'
      />

      <div className='burnsville-account-auth__inner'>
        <aside className='burnsville-account-auth__introduction'>
          <p className='burnsville-account-auth__eyebrow'>Account access</p>
          <h2>Welcome back</h2>
          <p>Sign in to review your account and order details.</p>
          <div className='burnsville-account-auth__accent' aria-hidden='true' />
        </aside>

        <div className='burnsville-account-auth__panel'>
          <header>
            <p className='burnsville-account-auth__eyebrow'>Member sign in</p>
            <h1 id='burnsville-login-title'>Sign in</h1>
          </header>

          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}

          <form onSubmit={submitHandler}>
            <div className='burnsville-account-auth__field'>
              <label htmlFor='email'>Email address</label>
              <input
                id='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='burnsville-account-auth__field'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type='submit'>Sign in</button>
          </form>

          <p className='burnsville-account-auth__switch'>
            New customer?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

LoginScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default LoginScreen;
