import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { saveShippingAddress } from '../actions/cartActions';
import './shipping-location.css';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [locationState, setLocationState] = useState('idle');
  const [locationMessage, setLocationMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartItems.length === 0) {
      history.replace('/cart');
      return;
    }

    if (!userInfo) {
      history.replace('/login?redirect=shipping');
    }
  }, [cartItems.length, history, userInfo]);

  const resolveLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${encodeURIComponent(
          latitude
        )}&lon=${encodeURIComponent(longitude)}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const result = await response.json();
      const details = result.address || {};
      const road = details.road || details.pedestrian || details.footway || details.path || '';
      const streetAddress = [details.house_number, road].filter(Boolean).join(' ');
      const resolvedCity =
        details.city ||
        details.town ||
        details.village ||
        details.municipality ||
        details.suburb ||
        '';

      if (streetAddress) {
        setAddress(streetAddress);
      }
      if (resolvedCity) {
        setCity(resolvedCity);
      }
      if (details.postcode) {
        setPostalCode(details.postcode);
      }
      if (details.country) {
        setCountry(details.country);
      }

      if (!streetAddress && !resolvedCity && !details.postcode && !details.country) {
        throw new Error('No address details returned');
      }

      setLocationState('success');
      setLocationMessage('Location found. Check the address before continuing.');
    } catch (error) {
      setLocationState('warning');
      setLocationMessage(
        'Location found, but the address could not be filled in. Enter it manually.'
      );
    }
  };

  const requestPosition = (options) =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationState('error');
      setLocationMessage('Location services are not supported by this browser.');
      return;
    }

    setLocationState('locating');
    setLocationMessage('Finding your location…');

    try {
      let position;

      try {
        position = await requestPosition({
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 300000,
        });
      } catch (firstError) {
        if (firstError.code === 1) {
          throw firstError;
        }

        setLocationMessage('Trying an approximate location…');
        position = await requestPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 900000,
        });
      }

      const { latitude, longitude } = position.coords;
      await resolveLocation(latitude, longitude);
    } catch (error) {
      setLocationState('error');

      if (error.code === 1) {
        setLocationMessage('Location permission was denied. Enable it in the browser or enter the address manually.');
      } else if (error.code === 3) {
        setLocationMessage('Location request timed out. Try again or enter the address manually.');
      } else if (error.code === 2) {
        setLocationMessage('Your device could not provide a location. Check browser or system Location Services, then try again.');
      } else {
        setLocationMessage('We could not detect your location. Enter the address manually.');
      }
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };

  if (cartItems.length === 0 || !userInfo) {
    return null;
  }

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
                autoComplete='shipping street-address'
                placeholder='Enter address'
                value={address}
                required
                onChange={(event) => setAddress(event.target.value)}
              />
              <div className='burnsville-checkout__location-tools'>
                <button
                  className='burnsville-checkout__location-button'
                  type='button'
                  onClick={useCurrentLocation}
                  disabled={locationState === 'locating'}
                >
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    focusable='false'
                  >
                    <path d='M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z' />
                  </svg>
                  {locationState === 'locating' ? 'Locating…' : 'Use current location'}
                </button>

                {locationMessage && (
                  <p
                    className={`burnsville-checkout__location-status burnsville-checkout__location-status--${locationState}`}
                    role='status'
                    aria-live='polite'
                  >
                    {locationMessage}
                  </p>
                )}
              </div>
            </div>

            <div className='burnsville-checkout__field'>
              <label htmlFor='city'>City</label>
              <input
                id='city'
                type='text'
                autoComplete='shipping address-level2'
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
                autoComplete='shipping postal-code'
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
                autoComplete='shipping country-name'
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
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default ShippingScreen;
