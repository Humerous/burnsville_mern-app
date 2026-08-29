import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import colors from 'colors';
import connectDB from './config/db.js';

// <---- ROUTES IMPORT BELOW ---->
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// <---- .env / CONNECT  ---->
dotenv.config();
connectDB();
const app = express();

// <---- MIDDLEWARE  ---->
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// <---- ROUTES USE BELOW ---->
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// <----PAYPAL API ---->
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// <---- PRODUCTION STATIC ASSETS ---->
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, 'frontend', 'dist');

  app.use(express.static(frontendDistPath));

  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendDistPath, 'index.html'))
  );
} else {
  // <---- GET (WORKING ROUTE) ---->
  app.get('/', (req, res) => {
    res.send('API is working');
  });
}

// <---- HANDLERS---->
app.use(notFound);
app.use(errorHandler);

// <----SERVER PORT LISTENING ON 5000 ---->
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, listening on port http://localhost:${PORT}`
      .magenta.bold
  );
});
