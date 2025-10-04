const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders // <-- import it here
} = require('../controllers/orderController');

const router = express.Router();

// Admin fetch all orders

// Order operations
router.post('/orders', createOrder);
router.get('/orders/:orderId', getOrderById);
router.get('/orders/user/:userId', getUserOrders);

module.exports = router;
