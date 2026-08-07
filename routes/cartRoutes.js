const express = require('express');

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

// ================= GET CART =================

router.get('/:userId', getCart);

// ================= ADD TO CART =================

router.post('/:userId/add', addToCart);

// ================= UPDATE CART =================

router.put('/:userId/update', updateCart);

// ================= REMOVE FROM CART =================

router.delete('/:userId/remove', removeFromCart);

// ================= CLEAR CART =================

router.delete('/:userId/clear', clearCart);

module.exports = router;