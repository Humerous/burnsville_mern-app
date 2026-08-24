import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };

  return (
    <section
      className='burnsville-checkout'
      aria-labelledby='burnsville-shipping-title'
    >
      <Meta
        title='Shipping | Burnsville'
        description='Enter the shipping details for your Burnsville order.'
      />

      <div className='burnsville-checkout__inner'>
        <CheckoutSteps step1 step2 />

        <div className='burnsville-checkout__layout'>
          <header className='burnsville-checkout__introduction'>
            <p className='burnsville-checkout__eyebrow'>Checkout step 2</p>
            <h1 id='burnsville-shipping-title'>Shipping details</h1>
            <p>Enter the address for this order.</p>
            <div className='burnsville-checkout__accent' aria-hidden='true' />
          </header>

          <form className='burnsville-checkout__form' onSubmit={submitHandler}>
            <div className='burnsville-checkout__form-heading'>
              <p className='burnsville-checkout__eyebrow'>Delivery address</p>
              <h2>Where should the order go?</h2>
            </div>

            <div className='burnsville-checkout__field burnsville-checkout__field--wide'>
              <label htmlFor='address'>Address</label>
              <input
                id='address'
                type='text'
                placeholder='Enter address'
                value={address}
                required
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

            <div className='burnsville-checkout__field'>
              <label htmlFor='city'>City</label>
              <input
                id='city'
                type='text'
                placeholder='Enter city'
                value={city}
                required
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            <div className='burnsville-checkout__field'>
              <label htmlFor='postalCode'>Postal code</label>
              <input
                id='postalCode'
                type='text'
                placeholder='Enter postal code'
                value={postalCode}
                required
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </div>

            <div className='burnsville-checkout__field burnsville-checkout__field--wide'>
              <label htmlFor='country'>Country</label>
              <input
                id='country'
                type='text'
                placeholder='Enter country'
                value={country}
                required
                onChange={(event) => setCountry(event.target.value)}
              />
            </div>

            <button type='submit'>Continue to payment</button>
          </form>
        </div>
      </div>
    </section>
  );
};

ShippingScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ShippingScreen;
