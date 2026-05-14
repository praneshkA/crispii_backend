const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    prices: {

      "1000g": {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
      },

      "500g": {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
      },

      "250g": {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
      },

    },

    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

  },
  {
    timestamps: true,
  }
);


// ================= VIRTUAL FIELD =================

productSchema.virtual('isOutOfStock').get(function () {

  return this.stock <= 0;

});


// ================= RESPONSE SETTINGS =================

productSchema.set('toJSON', {
  virtuals: true,
});

productSchema.set('toObject', {
  virtuals: true,
});


module.exports = mongoose.model(
  'Product',
  productSchema
);