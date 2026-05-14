const Cart = require('../models/cart');
const Product = require('../models/Product');


// ================= GET CART =================

exports.getCart = async (req, res) => {

  try {

    const userId = req.params.userId || 'guest';

    let cart = await Cart.findOne({ userId });

    if (!cart) {

      cart = new Cart({
        userId,
        items: [],
      });

      await cart.save();

    }

    return res.status(200).json(cart.items);

  } catch (err) {

    console.error('GET CART ERROR:', err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};


// ================= ADD TO CART =================

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.userId || 'guest';

    const {
      productId,
      name,
      image,
      selectedQuantity,
      price,
      quantity,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    // OUT OF STOCK CHECK
    if (product.stock <= 0 || product.isOutOfStock) {
      return res.status(400).json({
        error: 'Product is out of stock',
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        item.selectedQuantity === selectedQuantity
    );

    if (existingItemIndex > -1) {

      const newQty =
        cart.items[existingItemIndex].quantity + (quantity || 1);

      // STOCK LIMIT CHECK
      if (newQty > product.stock) {
        return res.status(400).json({
          error: `Only ${product.stock} items available`,
        });
      }

      cart.items[existingItemIndex].quantity = newQty;

    } else {

      if ((quantity || 1) > product.stock) {
        return res.status(400).json({
          error: `Only ${product.stock} items available`,
        });
      }

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

    res.json({
      message: 'Item added to cart',
      items: cart.items,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};


// ================= UPDATE CART =================

exports.updateCart = async (req, res) => {

  try {

    const userId = req.params.userId || 'guest';

    const {
      productId,
      selectedQuantity,
      quantity,
    } = req.body;

    if (quantity <= 0) {

      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      });

    }

    // Find product

    const product = await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });

    }

    // Prevent stock overflow

    if (quantity > product.stock) {

      return res.status(400).json({
        success: false,
        error: `Only ${product.stock} items available`,
      });

    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {

      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });

    }

    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        item.selectedQuantity === selectedQuantity
    );

    if (itemIndex === -1) {

      return res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });

    }

    cart.items[itemIndex].quantity = quantity;

    cart.updatedAt = Date.now();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      items: cart.items,
    });

  } catch (err) {

    console.error('UPDATE CART ERROR:', err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};


// ================= REMOVE FROM CART =================

exports.removeFromCart = async (req, res) => {

  try {

    const userId = req.params.userId || 'guest';

    const {
      productId,
      selectedQuantity,
    } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {

      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });

    }

    cart.items = cart.items.filter(
      item =>
        !(
          item.productId.toString() === productId &&
          item.selectedQuantity === selectedQuantity
        )
    );

    cart.updatedAt = Date.now();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      items: cart.items,
    });

  } catch (err) {

    console.error('REMOVE CART ITEM ERROR:', err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};


// ================= CLEAR CART =================

exports.clearCart = async (req, res) => {

  try {

    const userId = req.params.userId || 'guest';

    const cart = await Cart.findOne({ userId });

    if (!cart) {

      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });

    }

    cart.items = [];

    cart.updatedAt = Date.now();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart cleared',
    });

  } catch (err) {

    console.error('CLEAR CART ERROR:', err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};