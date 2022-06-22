require('dotenv').config();

// export environment
module.exports = {
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  PG_HOST: process.env.PG_HOST,
  PG_USER: process.env.PG_USER,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_PORT: process.env.PG_PORT,

  JWT_SECRET: process.env.JWT_SECRET,

  STMP_SERVICE: process.env.STMP_SERVICE,
  STMP_USER: process.env.STMP_USER,
  STMP_PASS: process.env.STMP_PASS,
};
