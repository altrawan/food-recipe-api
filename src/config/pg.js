const { Pool } = require('pg');
const {
  PGHOST,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGPORT,
} = require('../helpers/env');

// pools will use environment variables
// for connection information
const db = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: PGPORT,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

// check connection
db.connect((err) => {
  if (err) {
    console.log(err);
  }
});

module.exports = db;
