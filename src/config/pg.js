require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// check connection
db.connect((err) => {
  if (err) {
    console.log(err);
  }
});

module.exports = db;
