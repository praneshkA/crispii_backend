const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_fallback';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalid' });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
