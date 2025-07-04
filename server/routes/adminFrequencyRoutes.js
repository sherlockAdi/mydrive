const express = require('express');
const router = express.Router();
const frequencyController = require('../controllers/frequencyController');
const auth = require('../middleware/auth');

function adminOnly(req, res, next) {
  console.log(req)
  if (req.user && req.user.roleId === 1) return next();
  return res.status(403).json({ message: 'Forbidden: admin only' });
}

router.use(auth, adminOnly);

router.get('/admin/frequencies', frequencyController.list);
router.post('/admin/frequencies', frequencyController.create);
router.put('/admin/frequencies/:id', frequencyController.update);
router.delete('/admin/frequencies/:id', frequencyController.delete);

module.exports = router; 