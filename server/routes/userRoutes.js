const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', userController.list);
router.post('/', userController.create);
router.put('/', userController.update);

module.exports = router; 