// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Serve images
app.get('/upload/images/:imageName', (req, res, next) => {
  const fs = require('fs');
  const imageName = decodeURIComponent(req.params.imageName || '');
  const imagesDir = path.join(__dirname, 'upload/images');

  const variants = new Set();
  variants.add(imageName);
  variants.add(imageName.replace(/_/g, ' '));
  variants.add(imageName.replace(/ /g, '_'));
  variants.add(imageName.toLowerCase());
  variants.add(imageName.toUpperCase());

  const title = imageName
    .split(/[-_ ]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
  variants.add(title);

  for (const v of variants) {
    const candidate = path.join(imagesDir, v);
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }
  }

  next();
});

app.use("/upload/images", express.static(path.join(__dirname, "upload/images")));

// Connect to MongoDB
mongoose.connect("mongodb+srv://pranesh:123@demo.wfefywo.mongodb.net/snacksdb?retryWrites=true&w=majority")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);

// Cart Schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  selectedQuantity: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' }, // For guest users
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);

// API: Get products (all or by category)
app.get("/api/products", async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get cart items
app.get("/api/cart/:userId", async (req, res) => {
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