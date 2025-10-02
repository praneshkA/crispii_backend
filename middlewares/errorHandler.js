const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error'
    : (err && (err.message || err.stack) ? (err.message || err.stack) : String(err));
  res.status(500).json({ success: false, message });
};

module.exports = errorHandler;
