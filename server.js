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

// Middleware
app.use(express.json());
// Update your parser limits here if you expect large payloads
// app.use(express.json({ limit: '5mb' }));

   const corsOptions = {
     origin: (origin, callback) => {
       // Allow requests with no origin (mobile apps, etc.)
       if (!origin) return callback(null, true);
       
       const allowedOrigins = [
         "http://localhost:5173",
         "http://127.0.0.1:5173",
         "http://localhost:3000",
         "http://127.0.0.1:3000",
         "https://crispii.netlify.app",
       ];
       
       if (allowedOrigins.includes(origin)) {
         return callback(null, true);
       } else {
         console.warn(`CORS blocked origin: ${origin}`);  // Log for debugging
         return callback(new Error('Not allowed by CORS'));
       }
     },
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
     credentials: true,
     optionsSuccessStatus: 200,  // For legacy browsers
   };

   // Apply CORS FIRST (before other middleware)
   app.use(cors(corsOptions));
   
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

connectDB();

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

app.use(express.json({ limit: '10mb' }));  // Uncomment and increase for large payloads (e.g., files)
   app.use(express.urlencoded({ extended: true, limit: '10mb' }));  // Add this for form data
   

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
