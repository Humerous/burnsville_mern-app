import mongoose from 'mongoose';

// <---- MONGODB CONNECTION STRING ---->
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MongoDB connection string is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const conn = await mongoose.connect(mongoUri);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn.connection;
};

// <---- EXPORT  ---->
export default connectDB;
