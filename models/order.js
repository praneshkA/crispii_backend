const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, default: 'guest' },

  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      image: String,
      selectedQuantity: String,
      price: Number,
      quantity: Number,
    }
  ],

  totalAmount: { type: Number, required: true },
  paymentScreenshot: { type: String },
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, default: 'processing' },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Order', orderSchema);
