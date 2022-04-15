require('dotenv').config();

// export environment
module.exports = {
  PORT: process.env.PORT,

  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGDATABASE: process.env.PGDATABASE,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT,

  JWT_SECRET: process.env.JWT_SECRET,

  STMP_SERVICE: process.env.STMP_SERVICE,
  STMP_USER: process.env.STMP_USER,
  STMP_PASS: process.env.STMP_PASS,

  RDS_URL: process.env.RDS_URL,
  RDS_PASS: process.env.RDS_PASS,
};
