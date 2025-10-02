require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_fallback'; // Fallback for safety

// Middleware
app.use(express.json());

// Simplified CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://crispii.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Serve images
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB fails to connect
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    console.log('[login] attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('[login] user not found for email:', email);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Defensive checks for password field
    if (!user.password) {
      console.error('[login] user record missing password field for:', email, 'user:', user._id);
      return res.status(500).json({ success: false, message: 'User password not set. Contact support.' });
    }

    // Ensure values are strings before comparing
    const provided = typeof password === 'string' ? password : String(password);
    const stored = typeof user.password === 'string' ? user.password : String(user.password);

    let valid;
    try {
      valid = await bcrypt.compare(provided, stored);
    } catch (bcryptErr) {
      console.error('[login] bcrypt.compare error for user:', user._id, bcryptErr);
      return res.status(500).json({ success: false, message: 'Error verifying credentials' });
    }

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : (error.message || String(error));
    res.status(500).json({ success: false, message });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });
    res.status(201).json({ success: true, token, userId: newUser._id });
  } catch (error) {
    console.error('Signup error:', error);
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : (error.message || String(error));
    res.status(500).json({ success: false, message });
  }
});

// Protected route example
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalid' });
    }
    req.userId = decoded.userId;
    next();
  });
};

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ success: true, message: 'You accessed a protected route', userId: req.userId });
});

// Product and Cart Schemas (unchanged)
const productSchema = new mongoose.Schema({ name: String, category: String, image: String, price: Number });
const Product = mongoose.model('Product', productSchema);

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  selectedQuantity: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});
const cartSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});
const Cart = mongoose.model('Cart', cartSchema);


// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, default: 'guest' },
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    selectedQuantity: String,
    price: Number,
    quantity: Number,
  }],
  totalAmount: { type: Number, required: true },
  paymentScreenshot: { type: String }, // Will store base64 or path
  paymentStatus: { type: String, default: 'pending' }, // pending, verified, rejected
  orderStatus: { type: String, default: 'processing' }, // processing, shipped, delivered
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// Cart APIs (unchanged)
app.get('/api/products', async (req, res) => {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/:userId/add', async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, name, image, selectedQuantity, price, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.selectedQuantity === selectedQuantity
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        productId,
        name,
        image,
        selectedQuantity,
        price,
        quantity: quantity || 1,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Item added to cart', items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cart/:userId/update', async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.selectedQuantity === selectedQuantity
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.updatedAt = Date.now();
      await cart.save();
      res.json({ message: 'Cart updated', items: cart.items });
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cart/:userId/remove', async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.selectedQuantity === selectedQuantity)
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Item removed from cart', items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cart/:userId/clear', async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, customerDetails, items, totalAmount, paymentScreenshot } = req.body;

    // Validate required fields
    if (!customerDetails || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order information' 
      });
    }

    // Generate unique order ID
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    const newOrder = new Order({
      orderId,
      userId: userId || 'guest',
      customerDetails,
      items,
      totalAmount,
      paymentScreenshot,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    await newOrder.save();

    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      orderId: orderId,
      order: newOrder 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create order' 
    });
  }
});

// Get Order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all orders for a user
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Global error handler to ensure JSON responses
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : (err && (err.message || err.stack) ? (err.message || err.stack) : String(err));
  res.status(500).json({ success: false, message });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));