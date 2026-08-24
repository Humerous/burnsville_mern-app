import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = ({ compact = false, onNavigate }) => (
  <Link
    aria-label='Burnsville Hot Sauce home'
    className={`burnsville-logo${compact ? ' burnsville-logo--compact' : ''}`}
    onClick={onNavigate}
    to='/'
  >
    <span className='burnsville-logo__art' aria-hidden='true'>
      <span className='burnsville-logo__wordmark'>BURNSVILLE</span>
      <span className='burnsville-logo__descriptor'>
        <span className='burnsville-logo__rule' />
        HOT SAUCE
        <span className='burnsville-logo__rule' />
      </span>
    </span>
  </Link>
);

export default BrandLogo;
