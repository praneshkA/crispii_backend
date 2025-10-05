const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { userId, customerDetails, items, totalAmount } = req.body;

    // Parse JSON strings if they come from FormData
    let parsedCustomerDetails = customerDetails;
    let parsedItems = items;

    if (typeof customerDetails === 'string') {
      parsedCustomerDetails = JSON.parse(customerDetails);
    }
    if (typeof items === 'string') {
      parsedItems = JSON.parse(items);
    }

    if (!parsedCustomerDetails || !parsedItems || parsedItems.length === 0 || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order information' 
      });
    }

    // Get Cloudinary URL from uploaded file
    const paymentScreenshotUrl = req.file ? req.file.path : null;

    if (!paymentScreenshotUrl) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot is required'
      });
    }

    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    const newOrder = new Order({
      orderId,
      userId: userId || 'guest',
      customerDetails: parsedCustomerDetails,
      items: parsedItems,
      totalAmount,
      paymentScreenshot: paymentScreenshotUrl, // Cloudinary URL
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    await newOrder.save();
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId,
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();
    await order.save();

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};