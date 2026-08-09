const express = require('express');

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/paymentController');

const router = express.Router();

// Create Razorpay order
router.post(
  '/create-order',
  createRazorpayOrder
);

// Verify Razorpay payment
router.post(
  '/verify',
  verifyRazorpayPayment
);

module.exports = router;