const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
