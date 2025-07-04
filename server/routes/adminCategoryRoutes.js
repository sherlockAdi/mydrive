const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Only allow roleId === 1
function adminOnly(req, res, next) {
  if (req.user && req.user.roleId === 1) return next();
  return res.status(403).json({ message: 'Forbidden: admin only' });
}

router.use(auth, adminOnly);

router.get('/admin/categories', categoryController.list);
router.post('/admin/categories', categoryController.create);
router.put('/admin/categories/:id', categoryController.update);
router.delete('/admin/categories/:id', categoryController.delete);

module.exports = router; 