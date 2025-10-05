const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Admin fetch all orders
router.get('/orders/all', getAllOrders);

// Order operations
router.post('/orders', upload.single('paymentScreenshot'), createOrder);
router.get('/orders/:orderId', getOrderById);
router.get('/orders/user/:userId', getUserOrders);
router.put('/orders/:orderId', updateOrderStatus);

module.exports = router;