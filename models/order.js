const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    required: true,
    unique: true
  },

  userId: {
    type: String,
    default: 'guest'
  },

  customerDetails: {

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String
    },

    address: {
      type: String,
      required: true
    },

    apartment: {
      type: String
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

  },

  items: [{

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },

    name: String,

    image: String,

    selectedQuantity: String,

    price: Number,

    quantity: Number,

  }],

  totalAmount: {
    type: Number,
    required: true
  },

  // Old payment screenshot field
  // Keeping it for existing orders
  paymentScreenshot: {
    type: String
  },

  // Payment status
  paymentStatus: {
    type: String,
    default: 'pending'
  },

  // Payment method
  paymentMethod: {
    type: String,
    default: 'razorpay'
  },

  // Razorpay Order ID
  razorpayOrderId: {
    type: String
  },

  // Razorpay Payment ID
  razorpayPaymentId: {
    type: String
  },

  // Razorpay signature used for verification
  razorpaySignature: {
    type: String
  },

  // Order status
  orderStatus: {
    type: String,
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Order', orderSchema);