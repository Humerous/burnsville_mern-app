import bcrypt from 'bcryptjs';

// <---- DUMMY USER DATA  - mongo DataBase ---->
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Kenny Rogers',
    email: 'kenny@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Imraan Stormy Spam',
    email: 'imraan@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

// <---- EXPORT ---->
export default users;
