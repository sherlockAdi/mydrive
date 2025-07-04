module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Server error', error: err.message });
}; 