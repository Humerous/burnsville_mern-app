import jwt from 'jsonwebtoken';

// <---- GENERATE NEW TOKEN - id ---->

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// <---- EXPORTS --->
export default generateToken;
