//favouriteconteoller.js
const Favourite = require('../models/favourite');
const Product = require('../models/Product');

// Get all favourites for a user
exports.getFavourites = async (req, res) => {
  const userId = req.params.userId || 'guest';
  try {
    let fav = await Favourite.findOne({ userId });
    if (!fav) return res.json([]);
    res.json(fav.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favourites' });
  }
};

// Add a product to favourites
exports.addFavourite = async (req, res) => {
  const userId = req.params.userId || 'guest';
  const { productId, name, image, selectedQuantity, price } = req.body;
  try {
    let fav = await Favourite.findOne({ userId });
    if (!fav) fav = new Favourite({ userId, items: [] });
    if (fav.items.some(item => item.productId.toString() === productId)) {
      return res.status(400).json({ error: 'Already in favourites' });
    }
    fav.items.push({ productId, name, image, selectedQuantity, price });
    fav.updatedAt = new Date();
    await fav.save();
    res.json(fav.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favourite' });
  }
};

// Remove a product from favourites
exports.removeFavourite = async (req, res) => {
  const userId = req.params.userId || 'guest';
  const { productId } = req.body;
  try {
    let fav = await Favourite.findOne({ userId });
    if (!fav) return res.json([]);
    fav.items = fav.items.filter(item => item.productId.toString() !== productId);
    fav.updatedAt = new Date();
    await fav.save();
    res.json(fav.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favourite' });
  }
};
