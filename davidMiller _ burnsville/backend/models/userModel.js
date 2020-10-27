import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// <---- NEW USER SCHEMA- new user for mongoDB schema ---->
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
  return await bcrypt.compare(enteredPassword, this.password);
};
// <---- NEW USER SCHEMA- match password - entered correct password ---->
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // <---- NEW USER SCHEMA- salt and hash password ---->
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// <---- NEW USER SCHEMA- model ---->
const User = mongoose.model('User', userSchema);

// <---- EXPORT ---->
export default User;
