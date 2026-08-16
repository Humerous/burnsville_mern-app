import React from 'react';
import { Spinner } from 'react-bootstrap';

// <---- LOADER FUNCTION ---->
const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

// <---- EXPORT ---->
export default Loader;
