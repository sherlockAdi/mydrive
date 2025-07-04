const { poolPromise } = require('../db');
const path = require('path');
const { uploadFile, getFileStream, getPublicFileUrl } = require('../utils/b2');
const nodemailer = require('nodemailer');
const { smtp } = require('../config');

// 1. Get all categories
exports.getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_Category');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Get periods for a category
exports.getPeriods = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoryId', categoryId)
      .query('SELECT * FROM DOC_M_Period WHERE categoryId = @categoryId');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. Get subtypes for a category
exports.getSubTypes = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoryId', categoryId)
      .query('SELECT * FROM DOC_M_SubType WHERE categoryId = @categoryId');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. Get document metadata for a cell
exports.getDocument = async (req, res) => {
  const { categoryId, periodId, subTypeId } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('periodId', periodId)
      .input('subTypeId', subTypeId)
      .query('SELECT TOP 1 * FROM DOC_T_Document WHERE periodId = @periodId AND subTypeId = @subTypeId');
    const doc = result.recordset[0];
    if (!doc) return res.json({ status: 'success', data: null });
    // Get file metadata
    const fileRes = await pool.request()
      .input('fileId', doc.fileId)
      .query('SELECT * FROM DOC_T_File WHERE id = @fileId');
    const file = fileRes.recordset[0];
    res.json({ status: 'success', data: { ...doc, file } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. Upload or replace a document
exports.uploadDocument = async (req, res) => {
  const { categoryId, periodId, subTypeId, uploadedByUid } = req.body;
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  try {
    const pool = await poolPromise;
    // Get names for renaming
    const [cat, period, subtype] = await Promise.all([
      pool.request().input('id', categoryId).query('SELECT name FROM DOC_M_Category WHERE id = @id'),
      pool.request().input('id', periodId).query('SELECT label FROM DOC_M_Period WHERE id = @id'),
      pool.request().input('id', subTypeId).query('SELECT name FROM DOC_M_SubType WHERE id = @id'),
    ]);
    const categoryName = cat.recordset[0]?.name || 'Category';
    const periodLabel = period.recordset[0]?.label || 'Period';
    const subTypeName = subtype.recordset[0]?.name || 'SubType';
    const ext = path.extname(req.file.originalname);
    const fileName = `${categoryName}_${periodLabel}_${subTypeName}_${uploadedByUid}${ext}`.replace(/\s+/g, '_');
    // Upload to B2
    const b2res = await uploadFile(req.file.buffer, fileName, req.file.mimetype);
    const storagePath = b2res.fileName;
    // Insert into DOC_T_File
    const fileResult = await pool.request()
      .input('name', fileName)
      .input('ownerUid', uploadedByUid)
      .input('type', req.file.mimetype)
      .input('size', req.file.size)
      .input('description', req.body.description || '')
      .input('priority', req.body.priority || null)
      .input('storagePath', storagePath)
      .query('INSERT INTO DOC_T_File (name, ownerUid, type, size, description, priority, storagePath) OUTPUT INSERTED.id VALUES (@name, @ownerUid, @type, @size, @description, @priority, @storagePath)');
    const fileId = fileResult.recordset[0].id;
    // Upsert DOC_T_Document
    // Check if exists
    const docRes = await pool.request()
      .input('periodId', periodId)
      .input('subTypeId', subTypeId)
      .query('SELECT TOP 1 id FROM DOC_T_Document WHERE periodId = @periodId AND subTypeId = @subTypeId');
    if (docRes.recordset.length > 0) {
      // Update
      await pool.request()
        .input('id', docRes.recordset[0].id)
        .input('fileId', fileId)
        .input('uploadedByUid', uploadedByUid)
        .query('UPDATE DOC_T_Document SET fileId = @fileId, uploadedByUid = @uploadedByUid, uploadedAt = GETDATE() WHERE id = @id');
    } else {
      // Insert
      await pool.request()
        .input('name', fileName)
        .input('fileId', fileId)
        .input('subTypeId', subTypeId)
        .input('periodId', periodId)
        .input('uploadedByUid', uploadedByUid)
        .query('INSERT INTO DOC_T_Document (name, fileId, subTypeId, periodId, uploadedByUid) VALUES (@name, @fileId, @subTypeId, @periodId, @uploadedByUid)');
    }
    // Fetch user details
    const userRes = await pool.request()
      .input('uid', uploadedByUid)
      .query('SELECT * FROM ATM_usersdetails WHERE uid = @uid');
    const user = userRes.recordset[0];
    // Send email notification
    const transporter = nodemailer.createTransport(smtp);
    await transporter.sendMail({
      from: smtp.auth.user,
      to: 'dg@atm.edu.in',
      subject: 'Document Uploaded Notification',
      text: `A document was uploaded.\n\nDocument Details:\n- Name: ${fileName}\n- Category: ${categoryName}\n- Period: ${periodLabel}\n- SubType: ${subTypeName}\n- Size: ${req.file.size}\n- Type: ${req.file.mimetype}\n\nUser Details:\n- UID: ${user?.uid}\n- Name: ${user?.username || ''}\n- Email: ${user?.useremail || ''}`
    });
    res.json({ status: 'success', message: 'File uploaded', fileId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 6. Download a document
exports.downloadDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const fileRes = await pool.request().input('id', id).query('SELECT * FROM DOC_T_File WHERE id = @id');
    const file = fileRes.recordset[0];
    if (!file) return res.status(404).json({ status: 'error', message: 'File not found' });
    // Fetch real user details from JWT
    const userRes = await pool.request()
      .input('uid', req.user.linkId)
      .query('SELECT * FROM ATM_usersdetails WHERE uid = @uid');
    const user = userRes.recordset[0];
    // Send email notification
    const transporter = nodemailer.createTransport(smtp);
    await transporter.sendMail({
      from: smtp.auth.user,
      to: 'dg@atm.edu.in',
      subject: 'Document Downloaded Notification',
      text: `A document was downloaded.\n\nDocument Details:\n- Name: ${file.name}\n- Type: ${file.type}\n- Size: ${file.size}\n- Description: ${file.description || ''}\n- Priority: ${file.priority || ''}\n\nUser Details:\n- UID: ${user?.uid}\n- Name: ${user?.username || ''}\n- Email: ${user?.useremail || ''}`
    });
    // Get a readable stream from B2
    const stream = await getFileStream(file.storagePath);
    // Set headers for download
    res.setHeader('Content-Type', file.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=\"${file.name}\"`);
    // Pipe the B2 stream to the response
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get all frequencies
exports.getFrequencies = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_Frequency');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get frequency for a given category (parent) ID
exports.getCategoryFrequency = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoryId', categoryId)
      .query(`
        SELECT f.*
        FROM DOC_M_Category c
        JOIN DOC_M_Frequency f ON c.frequencyId = f.id
        WHERE c.id = @categoryId
      `);
    if (!result.recordset[0]) {
      return res.status(404).json({ status: 'error', message: 'Frequency not found for this category' });
    }
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 