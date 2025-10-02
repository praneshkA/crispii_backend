const express = require('express');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const router = express.Router();

router.get('/cart/:userId', getCart);
router.post('/cart/:userId/add', addToCart);
router.put('/cart/:userId/update', updateCart);
router.delete('/cart/:userId/remove', removeFromCart);
router.delete('/cart/:userId/clear', clearCart);

module.exports = router;
