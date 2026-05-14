const express = require('express');

const router = express.Router();

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  updateAllStock,
} = require('../controllers/productController');


// ================= GET ALL PRODUCTS =================

router.get('/', getProducts);


// ================= GET SINGLE PRODUCT =================

router.get('/:id', getProductById);


// ================= CREATE PRODUCT =================

router.post('/', addProduct);


// ================= BULK UPDATE ALL STOCK =================

router.put('/update-all-stock', updateAllStock);


// ================= UPDATE PRODUCT =================

router.put('/:id', updateProduct);


// ================= UPDATE STOCK ONLY =================

router.patch('/stock/:id', updateStock);


// ================= DELETE PRODUCT =================

router.delete('/:id', deleteProduct);


module.exports = router;