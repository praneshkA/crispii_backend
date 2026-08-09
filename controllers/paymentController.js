const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // Check amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    // Convert rupees to paise
    const amountInPaise = Math.round(
      Number(amount) * 100
    );

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `crispii_${Date.now()}`,
    };

    // Create Razorpay order
    const razorpayOrder =
      await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message:
        'Razorpay order created successfully',
      order: razorpayOrder,
    });

  } catch (error) {
    console.error(
      'Razorpay order creation error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Check required payment details

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment verification details are missing',
      });
    }

    // Create expected signature

    const generatedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest('hex');

    // Compare signatures

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      console.error(
        'Razorpay signature verification failed'
      );

      return res.status(400).json({
        success: false,
        message:
          'Payment verification failed',
      });
    }

    // Payment verified

    console.log(
      'Razorpay payment verified successfully'
    );

    console.log(
      'Razorpay Order ID:',
      razorpay_order_id
    );

    console.log(
      'Razorpay Payment ID:',
      razorpay_payment_id
    );

    res.status(200).json({
      success: true,
      message:
        'Payment verified successfully',

      payment: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });

  } catch (error) {
    console.error(
      'Razorpay payment verification error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Payment verification failed',
      error: error.message,
    });
  }
};