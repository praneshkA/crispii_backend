//cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
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

module.exports = mongoose.model('Cart', cartSchema);
