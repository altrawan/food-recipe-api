const redis = require('redis');
const { RDS_HOST, RDS_PORT, RDS_PASS } = require('../helpers/env');

let client;
if (RDS_HOST) {
  client = redis.createClient({
    host: RDS_HOST,
    port: RDS_PORT,
    password: RDS_PASS,
  });
} else {
  client = redis.createClient();
}
// const client = redis.createClient({
//   host: RDS_HOST,
//   port: RDS_PORT,
//   password: RDS_PASS,
// });

// client.on('error', (err) => console.log(`Redis Client Error : ${err}`));
// client.on('connect', () => console.log(`You're now connected db redis`));

// client.connect();

module.exports = client;
