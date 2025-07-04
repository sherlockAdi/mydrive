const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

router.use(auth);
// Get all categories
router.get('/categories', documentController.getCategories);
// Get periods for a category
router.get('/categories/:categoryId/periods', documentController.getPeriods);
// Get subtypes for a category
router.get('/categories/:categoryId/subtypes', documentController.getSubTypes);
// Get document metadata for a cell
router.get('/documents', documentController.getDocument);
// Upload or replace a document
router.post('/documents/upload', upload.single('file'), documentController.uploadDocument);
// Download a document
router.get('/documents/:id/download', documentController.downloadDocument);
// Get all frequencies
router.get('/frequencies', documentController.getFrequencies);
// Get frequency for a given category (parent) ID
router.get('/categories/:categoryId/frequency', documentController.getCategoryFrequency);

module.exports = router; 