const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}; 