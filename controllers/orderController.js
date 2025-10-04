const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, customerDetails, items, totalAmount, paymentScreenshot } = req.body;

    if (!customerDetails || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information',
      });
    }

    const orderId = Math.floor(100000 + Math.random() * 900000); // random 6-digit ID

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
      orderId,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific order by orderId
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

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
