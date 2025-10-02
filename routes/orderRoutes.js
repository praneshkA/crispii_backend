const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders/:orderId', getOrderById);
router.get('/orders/user/:userId', getUserOrders);

module.exports = router;
