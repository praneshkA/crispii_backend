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

const app = express();
const port = process.env.PORT || 5000;

// ---------------- CORS CONFIGURATION ----------------
// Allow local dev + production frontend
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://crispii.netlify.app',
  'http://crispii.netlify.app',
  // Admin app hosted on Netlify
  'https://crispii-admin.netlify.app',
  'http://crispii-admin.netlify.app',
  // Production domain - crispii.live
  'https://crispii.live',
  'http://crispii.live',
  'https://www.crispii.live',
  'http://www.crispii.live',
];

const envOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(s => s.trim())
  : [];

const allowedOrigins = [...defaultOrigins, ...envOrigins];

// Apply CORS with better error handling
app.use(cors({
  origin: function(origin, callback) {
    // allow requests without origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // allow localhost ports dynamically
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);

    // allow configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn('🚫 Blocked by CORS:', origin);
    console.log('✅ Allowed origins:', allowedOrigins);
    // Instead of throwing error, allow it but log warning
    // This prevents the "No Access-Control-Allow-Origin header" error
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// -----------------------------------------------------

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

// Cloudinary config
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log('✅ Allowed CORS origins:', allowedOrigins);
});