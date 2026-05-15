const express = require('express');

const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const {
  upload,
} = require('../middlewares/uploadMiddleware');

const router = express.Router();



// ================= GET ALL ORDERS =================

router.get('/all', getAllOrders);



// ================= CREATE ORDER =================

router.post(
  '/',
  upload.single('paymentScreenshot'),
  createOrder
);



// ================= GET ORDER BY ID =================

router.get('/:orderId', getOrderById);



// ================= GET USER ORDERS =================

router.get('/user/:userId', getUserOrders);



// ================= UPDATE ORDER =================

router.put('/:orderId', updateOrderStatus);



module.exports = router;