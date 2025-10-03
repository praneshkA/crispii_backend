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

// Default origins (local + deployed frontend)
const defaultFrontends = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://192.168.43.29:5173', // Local network IP
  'https://crispii.netlify.app',
  'http://crispii.netlify.app'
];

// Read from env FRONTEND_URLS (comma-separated) or FRONTEND_URL
const rawFrontends = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || defaultFrontends.join(',');
const allowedList = rawFrontends.split(',').map(s => s.trim()).filter(Boolean);

// Normalize entries (ensure http/https prefixes are included)
const normalizedOrigins = allowedList.flatMap(entry => {
  if (!entry) return [];
  const e = entry.replace(/\/$/, '');
  if (/^https?:\/\//i.test(e)) return [e];
  return [`http://${e}`, `https://${e}`];
});

// Apply CORS middleware FIRST
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (normalizedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('🚫 Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// -----------------------------------------------------

// Middleware
app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ extended: true, limit: '10mb' }));  

// Static file serving
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

// Connect DB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
