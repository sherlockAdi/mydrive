const { poolPromise } = require('../db');

// Dates must be passed as 'yyyy-MM-dd' strings from the frontend. Do not convert to JS Date objects.
const Period = {
  async all() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_Period');
    return result.recordset;
  },
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request().input('id', id).query('SELECT * FROM DOC_M_Period WHERE id = @id');
    return result.recordset[0];
  },
  async create({ categoryId, label, startDate, endDate }) {
    // Validate date format (yyyy-MM-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      throw new Error('startDate and endDate must be in yyyy-MM-dd format');
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoryId', categoryId)
      .input('label', label)
      .input('startDate', startDate)
      .input('endDate', endDate)
      .query('INSERT INTO DOC_M_Period (categoryId, label, startDate, endDate) OUTPUT INSERTED.* VALUES (@categoryId, @label, @startDate, @endDate)');
    return result.recordset[0];
  },
  async update(id, { categoryId, label, startDate, endDate }) {
    // Validate date format (yyyy-MM-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      throw new Error('startDate and endDate must be in yyyy-MM-dd format');
    }
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .input('categoryId', categoryId)
      .input('label', label)
      .input('startDate', startDate)
      .input('endDate', endDate)
      .query('UPDATE DOC_M_Period SET categoryId = @categoryId, label = @label, startDate = @startDate, endDate = @endDate WHERE id = @id');
    return this.findById(id);
  },
  async delete(id) {
    const pool = await poolPromise;
    await pool.request().input('id', id).query('DELETE FROM DOC_M_Period WHERE id = @id');
  }
};

module.exports = Period; 