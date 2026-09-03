import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// <---- NEW USER SCHEMA- new user for mongoDB schema ---->
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// <---- NEW USER SCHEMA- match password - entered correct password ---->
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// <---- NEW USER SCHEMA- hash changed passwords exactly once ---->
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// <---- NEW USER SCHEMA- model ---->
const User = mongoose.model('User', userSchema);

// <---- EXPORT ---->
export default User;
