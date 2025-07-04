const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const { poolPromise } = require('./db');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const documentRoutes = require('./routes/documentRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminFrequencyRoutes = require('./routes/adminFrequencyRoutes');
const adminPeriodRoutes = require('./routes/adminPeriodRoutes');
const adminSubTypeRoutes = require('./routes/adminSubTypeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection on startup
(async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 as test');
    console.log('Test DB Query Result:', result.recordset);
  } catch (err) {
    console.error('Test DB Error:', err);
  }
})();

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/api', documentRoutes);
app.use(adminCategoryRoutes);
app.use(adminFrequencyRoutes);
app.use(adminPeriodRoutes);
app.use(adminSubTypeRoutes);

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 