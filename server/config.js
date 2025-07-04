module.exports = {
  mssql: {
    user: 'betauser',
    password: 'Atm@12_34@56',
    server: '61.246.33.108',
    port: 5638,
    database: 'beta_ATM_COMM_U88',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  jwtSecret: 'aditya@123',
  b2: {
    endpoint: 'https://s3.us-west-002.backblazeb2.com',
    accessKeyId: '0057769a9a066d60000000004',
    secretAccessKey: 'K005xYfidpibPYD26PfXWxQyTqpedbA',
    bucket: 'mydrive-files',
    region: 'us-west-002',
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sw2@atm.edu.in',
      pass: 'hpht nnua txzr wlhl'
    }
  }
}; 