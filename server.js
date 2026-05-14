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

const app = express();

const port = process.env.PORT || 5000;



// ================= CORS CONFIG =================

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',

  'https://crispii.netlify.app',
  'http://crispii.netlify.app',

  'https://crispii-admin.netlify.app',
  'http://crispii-admin.netlify.app',

  'https://crispii.live',
  'http://crispii.live',

  'https://www.crispii.live',
  'http://www.crispii.live',
];

const envOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS
      .split(',')
      .map(origin => origin.trim())
  : [];

const allowedOrigins = [
  ...defaultOrigins,
  ...envOrigins,
];

const corsOptions = {
  origin: (origin, callback) => {

    // allow Postman/curl/server-side requests
    if (!origin) {
      return callback(null, true);
    }

    // allow localhost dynamically
    if (/^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    // allow configured origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn('🚫 Blocked by CORS:', origin);

    return callback(
      new Error('Not allowed by CORS')
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
  ],

  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
  ],

  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));



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



// ================= CLOUDINARY CONFIG =================

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// ================= START SERVER =================

const startServer = async () => {

  try {

    await connectDB();

    app.listen(port, () => {
      console.log(
        `🚀 Server running on http://localhost:${port}`
      );
    });

  } catch (error) {

    console.error(
      '❌ Failed to start server:',
      error.message
    );

    process.exit(1);

  }

};

startServer();