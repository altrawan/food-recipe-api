const redis = require('redis');
const { RDS_HOST, RDS_PORT, RDS_PASS, NODE_ENV } = require('../helpers/env');

let client;
if (NODE_ENV === 'development') {
  client = redis.createClient();
} else {
  client = redis.createClient({
    host: RDS_HOST,
    port: RDS_PORT,
    password: RDS_PASS,
  });
}

client.on('error', (err) => console.log(`Redis Client Error : ${err}`));
client.on('connect', () => console.log("You're now connected db redis ..."));

module.exports = client;
