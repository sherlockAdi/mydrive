const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { poolPromise } = require('../db');
const { jwtSecret, smtp } = require('../config');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'email and password are required' });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .query(`
        SELECT u.*, d.useremail as email
        FROM DOC_R_User u
        JOIN ATM_usersdetails d ON u.linkId = d.uid
        WHERE d.useremail = @email
      `);
    const user = result.recordset[0];
    console.log(user)
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    // if (!valid) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, linkId: user.linkId, email: user.email ,roleId:user.roleId }, jwtSecret, { expiresIn: '1d' });
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, linkId: user.linkId, email: user.email ,roleId:user.roleId}
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Login failed', error: err.message });
  }
};

exports.register = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }
  try {
    const pool = await poolPromise;
    // Check if email exists in ATM_usersdetails
    const userRes = await pool.request()
      .input('email', email)
      .query('SELECT uid, useremail FROM ATM_usersdetails WHERE useremail = @email');
    const atmUser = userRes.recordset[0];
    if (!atmUser) {
      return res.status(404).json({ status: 'error', message: 'Email not found in ATM users' });
    }
    // Check if already registered
    const regRes = await pool.request()
      .input('linkId', atmUser.uid)
      .query('SELECT * FROM DOC_R_User WHERE linkId = @linkId');
    if (regRes.recordset.length > 0) {
      return res.status(400).json({ status: 'error', message: 'User already registered' });
    }
    // Generate password
    const password = crypto.randomBytes(4).toString('hex');
    const hash = await bcrypt.hash(password, 10);
    // Insert into DOC_R_User
    await pool.request()
      .input('linkId', atmUser.uid)
      .input('password', hash)
      .query('INSERT INTO DOC_R_User (linkId, password) VALUES (@linkId, @password)');
    // Send password to user's email
    const transporter = nodemailer.createTransport(smtp);
    await transporter.sendMail({
      from: smtp.auth.user,
      to: email,
      subject: 'Your MyDrive Registration Password',
      text: `Welcome to MyDrive!\n\nYour password is: ${password}\n\nPlease log in and change your password after first login.`,
    });
    res.json({ status: 'success', message: 'Registration successful. Password sent to your email.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Registration failed', error: err.message });
  }
}; 