//cart controller.js
const Cart = require('../models/cart');

exports.getCart = async (req, res) => {
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
};

exports.addToCart = async (req, res) => {
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
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

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
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const { productId, selectedQuantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.selectedQuantity === selectedQuantity)
    );
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Item removed from cart', items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
