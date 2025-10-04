const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// Create new order
router.post('/orders', createOrder);

// Get a specific order
router.get('/orders/:orderId', getOrderById);

// Get all orders of a user
router.get('/orders/user/:userId', getUserOrders);

// ✅ Admin - get all orders
router.get('/orders/all', getAllOrders);

// ✅ Admin - update order status
router.put('/orders/:orderId', updateOrderStatus);

module.exports = router;
