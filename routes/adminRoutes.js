//admin routes
const express = require('express');
const { createAdmin, loginAdmin } = require('../controllers/adminController');
const router = express.Router();

// Only allow creating admin if no admin exists (for first time setup)
router.post('/create', createAdmin);
router.post('/login', loginAdmin);

module.exports = router;
