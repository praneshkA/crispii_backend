// backend/routes/products.js
const express = require("express");
const Products = require("../ProductData"); // your ProductData.js
const router = express.Router();

// GET /api/products?category=Kaaram
router.get("/", (req, res) => {
  const category = req.query.category;
  if (category) {
    const filtered = Products.filter((p) => p.category === category);
    res.json(filtered);
  } else {
    res.json(Products);
  }
});

module.exports = router;
