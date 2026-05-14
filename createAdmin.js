require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Admin = require('./models/admin');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
    });

    await admin.save();

    console.log('✅ Admin created successfully');

    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });