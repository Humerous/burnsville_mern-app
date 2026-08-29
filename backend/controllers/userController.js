import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

const normalizeEmail = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const normalizeName = (value) =>
  typeof value === 'string' ? value.trim() : '';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateName = (name, res) => {
  if (!name || name.length > 100) {
    res.status(400);
    throw new Error('Name must be between 1 and 100 characters');
  }
};

const validateEmail = (email, res) => {
  if (!email || email.length > 254 || !isValidEmail(email)) {
    res.status(400);
    throw new Error('Enter a valid email address');
  }
};

const validatePassword = (password, res) => {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    res.status(400);
    throw new Error('Password must be between 8 and 128 characters');
  }
};

const ensureEmailAvailable = async (email, currentUserId, res) => {
  const query = currentUserId
    ? { email, _id: { $ne: currentUserId } }
    : { email };
  const existingUser = await User.findOne(query);

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }
};

// <---- VALIDATE USER - email/password ---->
const authUser = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  if (!email || typeof password !== 'string' || !password) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// <---- REGISTER USER - email/password ---->
const registerUser = asyncHandler(async (req, res) => {
  const name = normalizeName(req.body.name);
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  validateName(name, res);
  validateEmail(email, res);
  validatePassword(password, res);
  await ensureEmailAvailable(email, null, res);

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// <---- USER PROFILE - email/password ---->
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// <---- UPDATE USER PROFILE - details ---->
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name !== undefined) {
    const name = normalizeName(req.body.name);
    validateName(name, res);
    user.name = name;
  }

  if (req.body.email !== undefined) {
    const email = normalizeEmail(req.body.email);
    validateEmail(email, res);
    await ensureEmailAvailable(email, user._id, res);
    user.email = email;
  }

  if (req.body.password) {
    validatePassword(req.body.password, res);
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
});

// <---- GET ALL USERS PROFILE - Admin ---->
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// <---- DELETE USERS PROFILE - Admin ---->
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// <---- GET USERS BY Ids PROFILE - Admin ---->
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// <---- GET USERS BY Ids AND UPDATE PROFILE - Admin ---->
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const name = normalizeName(req.body.name);
  const email = normalizeEmail(req.body.email);

  validateName(name, res);
  validateEmail(email, res);
  await ensureEmailAvailable(email, user._id, res);

  if (typeof req.body.isAdmin !== 'boolean') {
    res.status(400);
    throw new Error('Administrator access must be true or false');
  }

  if (
    req.user._id.toString() === user._id.toString() &&
    req.body.isAdmin === false
  ) {
    res.status(400);
    throw new Error('You cannot remove your own administrator access');
  }

  user.name = name;
  user.email = email;
  user.isAdmin = req.body.isAdmin;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

// <---- EXPORT ---->
export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
