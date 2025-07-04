const express = require('express');
const router = express.Router();
const subTypeController = require('../controllers/subTypeController');
const auth = require('../middleware/auth');

function adminOnly(req, res, next) {
  if (req.user && req.user.roleId === 1) return next();
  return res.status(403).json({ message: 'Forbidden: admin only' });
}

router.use(auth, adminOnly);

router.get('/admin/subtypes', subTypeController.list);
router.post('/admin/subtypes', subTypeController.create);
router.put('/admin/subtypes/:id', subTypeController.update);
router.delete('/admin/subtypes/:id', subTypeController.delete);

module.exports = router; 