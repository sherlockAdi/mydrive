const { poolPromise } = require('../db');

const Frequency = {
  async all() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DOC_M_Frequency');
    return result.recordset;
  },
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request().input('id', id).query('SELECT * FROM DOC_M_Frequency WHERE id = @id');
    return result.recordset[0];
  },
  async create({ code, name }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('code', code)
      .input('name', name)
      .query('INSERT INTO DOC_M_Frequency (code, name) OUTPUT INSERTED.* VALUES (@code, @name)');
    return result.recordset[0];
  },
  async update(id, { code, name }) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .input('code', code)
      .input('name', name)
      .query('UPDATE DOC_M_Frequency SET code = @code, name = @name WHERE id = @id');
    return this.findById(id);
  },
  async delete(id) {
    const pool = await poolPromise;
    await pool.request().input('id', id).query('DELETE FROM DOC_M_Frequency WHERE id = @id');
  }
};

module.exports = Frequency; 