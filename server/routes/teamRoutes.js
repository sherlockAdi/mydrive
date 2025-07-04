const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', teamController.list);
router.post('/', teamController.create);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.delete);

module.exports = router; 