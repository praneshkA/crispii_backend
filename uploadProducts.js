// backend/uploadProducts.js
const mongoose = require("mongoose");
const Products = require("./ProductData");
const Product = require("./models/Product");

// ⚠️ Use the same DB as your server.js
const MONGO_URI = "mongodb+srv://pranesh:123@demo.wfefywo.mongodb.net/snacksdb";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Clear old products if any
    await Product.deleteMany({});
    console.log("🗑️ Old products cleared");

    // Insert new products
    await Product.insertMany(Products);
    console.log("✅ Products uploaded successfully!");

    mongoose.disconnect();
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
