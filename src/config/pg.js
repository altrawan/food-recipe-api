const { Pool } = require('pg');
const {
  NODE_ENV,
  PG_HOST,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_PORT,
} = require('../helpers/env');

const config = {
  host: PG_HOST,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  port: PG_PORT,
};

if (NODE_ENV === 'production') {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = new Pool(config);

db.connect((err) => {
  if (err) {
    console.log('Failed to connect database...', err.message);
    process.exit(1);
  }
  console.log('Successfully connect database...');
});

module.exports = db;
