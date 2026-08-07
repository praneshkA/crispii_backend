require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const cloudinary = require('cloudinary').v2;

const app = express();

const port = process.env.PORT || 5000;



// ================= DATABASE =================

connectDB();



// ================= CLOUDINARY CONFIG =================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// ================= CORS =================

app.use(cors({
  origin: true,
  credentials: true,
}));



// ================= MIDDLEWARE =================

app.use(express.json({
  limit: '10mb',
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
}));



// ================= STATIC FILES =================

app.use(
  '/upload/images',
  express.static(
    path.join(__dirname, 'upload/images')
  )
);



// ================= ROUTES =================

app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);



// ================= HEALTH CHECK =================

app.get('/health', (req, res) => {

  res.status(200).json({
    success: true,
    message: 'Server is running',
  });

});



// ================= 404 HANDLER =================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: 'Route not found',
  });

});



// ================= GLOBAL ERROR HANDLER =================

app.use(errorHandler);



// ================= START SERVER =================

app.listen(port, () => {

  console.log(
    `🚀 Server running on port ${port}`
  );

});