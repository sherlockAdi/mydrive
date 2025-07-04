const { poolPromise } = require('../db');

const SubType = {
  async all() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_SubType');
    return result.recordset;
  },
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request().input('id', id).query('SELECT * FROM DOC_M_SubType WHERE id = @id');
    return result.recordset[0];
  },
  async create({ categoryId, name }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('categoryId', categoryId)
      .input('name', name)
      .query('INSERT INTO DOC_M_SubType (categoryId, name) OUTPUT INSERTED.* VALUES (@categoryId, @name)');
    return result.recordset[0];
  },
  async update(id, { categoryId, name }) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .input('categoryId', categoryId)
      .input('name', name)
      .query('UPDATE DOC_M_SubType SET categoryId = @categoryId, name = @name WHERE id = @id');
    return this.findById(id);
  },
  async delete(id) {
    const pool = await poolPromise;
    await pool.request().input('id', id).query('DELETE FROM DOC_M_SubType WHERE id = @id');
  }
};

module.exports = SubType; 