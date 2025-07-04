const sql = require('mssql');
const { mssql } = require('./config');

const poolPromise = new sql.ConnectionPool(mssql)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('MSSQL Connection Error:', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
}; 