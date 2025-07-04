const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');
const auth = require('../middleware/auth');

function adminOnly(req, res, next) {
  if (req.user && req.user.roleId === 1) return next();
  return res.status(403).json({ message: 'Forbidden: admin only' });
}

router.use(auth, adminOnly);

router.get('/admin/periods', periodController.list);
router.post('/admin/periods', periodController.create);
router.put('/admin/periods/:id', periodController.update);
router.delete('/admin/periods/:id', periodController.delete);

module.exports = router; 