const Product = require('../models/Product');


// ================= GET PRODUCTS =================

exports.getProducts = async (req, res) => {

  try {

    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

    console.error('GET PRODUCTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });

  }

};


// ================= GET SINGLE PRODUCT =================

exports.getProductById = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });

    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    console.error('GET PRODUCT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });

  }

};


// ================= CREATE PRODUCT =================

exports.addProduct = async (req, res) => {

  try {

    const {
      name,
      category,
      image,
      prices,
      stock,
    } = req.body;

    if (
      !name ||
      !category ||
      !image ||
      !prices ||
      prices['1000g'] === undefined ||
      prices['500g'] === undefined ||
      prices['250g'] === undefined ||
      stock === undefined
    ) {

      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });

    }

    // ================= VALIDATE PRICES =================

    if (
      prices['1000g'] < 0 ||
      prices['500g'] < 0 ||
      prices['250g'] < 0
    ) {

      return res.status(400).json({
        success: false,
        message: 'Prices cannot be negative',
      });

    }

    // ================= VALIDATE STOCK =================

    if (stock < 0) {

      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });

    }

    const product = new Product({
      name,
      category,
      image,
      prices,
      stock,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });

  } catch (error) {

    console.error('ADD PRODUCT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
    });

  }

};


// ================= UPDATE PRODUCT =================

exports.updateProduct = async (req, res) => {

  try {

    const {
      name,
      category,
      image,
      prices,
      stock,
    } = req.body;

    // ================= VALIDATE PRICES =================

    if (
      prices &&
      (
        prices['1000g'] < 0 ||
        prices['500g'] < 0 ||
        prices['250g'] < 0
      )
    ) {

      return res.status(400).json({
        success: false,
        message: 'Prices cannot be negative',
      });

    }

    // ================= VALIDATE STOCK =================

    if (
      stock !== undefined &&
      stock < 0
    ) {

      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });

    }

    const updatedData = {
      name,
      category,
      image,
      prices,
      stock,
    };

    Object.keys(updatedData).forEach((key) => {

      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }

    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });

    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });

  } catch (error) {

    console.error('UPDATE PRODUCT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });

  }

};


// ================= UPDATE STOCK =================

exports.updateStock = async (req, res) => {

  try {

    const { stock } = req.body;

    if (stock === undefined) {

      return res.status(400).json({
        success: false,
        message: 'Stock is required',
      });

    }

    if (stock < 0) {

      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });

    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });

    }

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product,
    });

  } catch (error) {

    console.error('UPDATE STOCK ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update stock',
    });

  }

};


// ================= BULK UPDATE ALL STOCK =================

exports.updateAllStock = async (req, res) => {

  try {

    const stock = Number(req.body.stock);

    if (isNaN(stock)) {

      return res.status(400).json({
        success: false,
        message: 'Valid stock value is required.',
      });

    }

    if (stock < 0) {

      return res.status(400).json({
        success: false,
        message: 'Stock must be non-negative.',
      });

    }

    const result = await Product.updateMany(
      {},
      { $set: { stock } }
    );

    return res.status(200).json({
      success: true,
      message: 'All product stocks updated successfully',
      modifiedCount: result.modifiedCount,
    });

  } catch (error) {

    console.error('BULK UPDATE STOCK ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update all product stocks',
    });

  }

};


// ================= DELETE PRODUCT =================

exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });

    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {

    console.error('DELETE PRODUCT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });

  }

};