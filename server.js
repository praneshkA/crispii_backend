require('dotenv').config(); // Make sure .env is loaded
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
const secretKey = process.env.JWT_SECRET;

// Middleware
app.use(express.json());

// CORS Setup - build a normalized allowlist (accept hostnames with/without scheme)
// Build allowedOriginsSet including your deployed frontend URLs and localhost URLs
let rawFrontends = process.env.FRONTEND_URLS || '';
const allowedOriginsSet = new Set();

rawFrontends
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .forEach(entry => {
    try {
      if (/^https?:\/\//i.test(entry)) {
        const u = new URL(entry);
        allowedOriginsSet.add(u.origin);
      } else {
        allowedOriginsSet.add(`https://${entry}`);
        allowedOriginsSet.add(`http://${entry}`);
      }
    } catch (e) {
      allowedOriginsSet.add(entry);
    }
  });

// Add localhost URLs explicitly so local frontend can access backend
['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000']
  .forEach(o => allowedOriginsSet.add(o));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOriginsSet.has(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked origin by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Serve images
app.use("/upload/images", express.static(path.join(__dirname, "upload/images")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

//login/signup
  app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid password" });

  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
  res.json({ success: true, token, userId: user._id });
});

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: "1h" });
  res.json({ success: true, token });
});
// Protected route example
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: "Token invalid" });
    req.userId = decoded.userId;
    next();
  });
};

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ success: true, message: "You accessed a protected route", userId: req.userId });
});

// Schemas
const productSchema = new mongoose.Schema({ name: String, category: String, image: String, price: Number });
const Product = mongoose.model("Product", productSchema);

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, image: String, selectedQuantity: String, price: Number,
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});
const cartSchema = new mongoose.Schema({ userId: { type: String, default: 'guest' }, items: [cartItemSchema], updatedAt: { type: Date, default: Date.now } });
const Cart = mongoose.model("Cart", cartSchema);

// APIs (same as before)
app.get("/api/products", async (req, res) => {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    let cart = await Cart.findOne({ userId });
    if (!cart) { cart = new Cart({ userId, items: [] }); await cart.save(); }
    res.json(cart.items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// API: Add to cart
app.post("/api/cart/:userId/add", async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, name, image, selectedQuantity, price, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item with same productId and selectedQuantity exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.selectedQuantity === selectedQuantity
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        image,
        selectedQuantity,
        price,
        quantity: quantity || 1
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({ message: "Item added to cart", items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Update cart item quantity
app.put("/api/cart/:userId/update", async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.selectedQuantity === selectedQuantity
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.updatedAt = Date.now();
      await cart.save();
      res.json({ message: "Cart updated", items: cart.items });
    } else {
      res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Remove from cart
app.delete("/api/cart/:userId/remove", async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity } = req.body;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.selectedQuantity === selectedQuantity)
    );

    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({ message: "Item removed from cart", items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Clear cart
app.delete("/api/cart/:userId/clear", async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));