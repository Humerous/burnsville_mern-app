import React from 'react';
import { Alert } from 'react-bootstrap';

// <---- MESSAGE FUNCTION - variant, children ---->
const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// <---- MESSAGE FUNCTION - defaultProps ---->
Message.defaultProps = {
  variant: 'info',
};

// <---- EXPORT ---->
export default Message;
