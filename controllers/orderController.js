const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { userId, customerDetails, items, totalAmount, paymentScreenshot } = req.body;

    if (!customerDetails || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order information' 
      });
    }
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    const newOrder = new Order({
      orderId,
      userId: userId || 'guest',
      customerDetails,
      items,
      totalAmount,
      paymentScreenshot,
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
