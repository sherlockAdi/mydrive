const { poolPromise } = require('../db');

const Category = {
  async all() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_Category');
    return result.recordset;
  },
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request().input('id', id).query('SELECT * FROM DOC_M_Category WHERE id = @id');
    return result.recordset[0];
  },
  async create({ code, name, frequencyId, description }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('code', code)
      .input('name', name)
      .input('frequencyId', frequencyId)
      .input('description', description || '')
      .query('INSERT INTO DOC_M_Category (code, name, frequencyId, description) OUTPUT INSERTED.* VALUES (@code, @name, @frequencyId, @description)');
    return result.recordset[0];
  },
  async update(id, { code, name, frequencyId, description }) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .input('code', code)
      .input('name', name)
      .input('frequencyId', frequencyId)
      .input('description', description || '')
      .query('UPDATE DOC_M_Category SET code = @code, name = @name, frequencyId = @frequencyId, description = @description WHERE id = @id');
    return this.findById(id);
  },
  async delete(id) {
    const pool = await poolPromise;
    await pool.request().input('id', id).query('DELETE FROM DOC_M_Category WHERE id = @id');
  }
};

module.exports = Category; 