const redis = require('redis');
const { RDS_URL } = require('../helpers/env');

// const client = redis.createClient({
//   url: RDS_URL,
// });

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis Client Error : ${err}`));
client.on('connect', () => console.log(`You're now connected db redis`));

client.connect();

module.exports = client;
