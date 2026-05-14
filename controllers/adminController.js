const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_fallback';


// ADMIN LOGIN
exports.loginAdmin = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      secretKey,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      adminId: admin._id,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message || 'Admin login failed',
    });

  }
};