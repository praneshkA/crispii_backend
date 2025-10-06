//favourites.js
const mongoose = require('mongoose');

const favouriteItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  selectedQuantity: String,
  price: Number,
  addedAt: { type: Date, default: Date.now },
});

const favouriteSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' },
  items: [favouriteItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Favourite', favouriteSchema);
