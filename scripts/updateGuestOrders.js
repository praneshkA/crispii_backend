// backend/scripts/updateGuestOrders.js
// This script helps you manually assign existing "guest" orders to real users

const mongoose = require('mongoose');
require('dotenv').config();

const orderSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  customerDetails: Object,
  items: Array,
  totalAmount: Number,
  paymentScreenshot: String,
  paymentStatus: String,
  orderStatus: String,
  createdAt: Date,
  updatedAt: Date
});

const Order = mongoose.model('Order', orderSchema);

async function updateGuestOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name');
    console.log('Connected to MongoDB');

    // Find all guest orders
    const guestOrders = await Order.find({ userId: 'guest' });
    console.log(`\nFound ${guestOrders.length} guest orders\n`);

    if (guestOrders.length === 0) {
      console.log('No guest orders to update');
      process.exit(0);
    }

    // Display all guest orders with their details
    console.log('Guest Orders:');
    console.log('═══════════════════════════════════════════════════════════');
    
    guestOrders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order.orderId}`);
      console.log(`   Email: ${order.customerDetails.email || 'N/A'}`);
      console.log(`   Phone: ${order.customerDetails.phone}`);
      console.log(`   Name: ${order.customerDetails.firstName} ${order.customerDetails.lastName || ''}`);
      console.log(`   Amount: ₹${order.totalAmount}`);
      console.log(`   Status: ${order.orderStatus}`);
      console.log(`   Created: ${order.createdAt}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('\nTo assign these orders to users:');
    console.log('1. Users need to login/signup first to get a userId');
    console.log('2. Match orders by phone/email with user accounts');
    console.log('3. Update userId in the database\n');
    
    console.log('Example: To update a specific order:');
    console.log('  await Order.updateOne(');
    console.log('    { orderId: "ORD123456" },');
    console.log('    { userId: "actual-user-id" }');
    console.log('  );\n');

    // Optional: Prompt for manual update (uncomment if you want interactive mode)
    /*
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Enter Order ID to update (or "skip" to exit): ', async (orderId) => {
      if (orderId !== 'skip') {
        readline.question('Enter new userId: ', async (newUserId) => {
          await Order.updateOne({ orderId }, { userId: newUserId });
          console.log(`Updated order ${orderId} with userId: ${newUserId}`);
          readline.close();
          process.exit(0);
        });
      } else {
        readline.close();
        process.exit(0);
      }
    });
    */

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateGuestOrders();